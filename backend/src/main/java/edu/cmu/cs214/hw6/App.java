package edu.cmu.cs214.hw6;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.ServiceLoader;
import java.util.stream.Collectors;

import edu.cmu.cs214.hw6.framework.DataPlugin;
import edu.cmu.cs214.hw6.framework.EntityAnalyzer;
import fi.iki.elonen.NanoHTTPD;
import com.google.gson.Gson;


public class App extends NanoHTTPD {

    public static void main(String[] args) {
        try {
            new App();
        } catch (IOException ioe) {
            System.err.println("Couldn't start server:\n" + ioe);
        }
    }

    private List<DataPlugin> dataPlugins;
    private EntityAnalyzer analyzer;
    private Gson gson;

    /**
     * Start the server at :8080 port.
     * @throws IOException
     */
    public App() throws IOException {
        super(8080);

        dataPlugins = loadPlugins();
        analyzer = new EntityAnalyzer();
        gson = new Gson();

        start(NanoHTTPD.SOCKET_READ_TIMEOUT, false);
        System.out.println("\nBackend server running at http://localhost:8080/ \n");
    }

    @Override
    public Response serve(IHTTPSession session) {
        String uri = session.getUri();
        Map<String, String> params = session.getParms();

        // TODO error handling for invalid params

        if (uri.equals("/get-plugins")) {
            // e.g., /get-plugins

            List<String> names = dataPlugins.stream()
                .map((DataPlugin plugin) -> plugin.getPluginName())
                .collect(Collectors.toList());

            return newFixedLengthResponse(gson.toJson(names));

        } else if (uri.equals("/get-plugin-options")){
            // e.g., /get-plugin-options?plugin=0

            int pluginId = Integer.parseInt(params.get("plugin"));
            List<String> messages = dataPlugins.get(pluginId).getParameterMessages();
            
            return newFixedLengthResponse(gson.toJson(messages));

        } else if (uri.equals("/plugin-options-valid")){
            // e.g., /plugin-options-valid?plugin=0&p0=sometext&p1=sometext...
            
            int pluginId = Integer.parseInt(params.get("plugin"));
            List<String> pluginParameters = new ArrayList<>();
            for (int i = 0; i < params.size() - 1; i++) {
                pluginParameters.add(params.get("p" + Integer.toString(i)));
            }

            String msg = dataPlugins.get(pluginId).getInvalidMessage(pluginParameters);
            return newFixedLengthResponse((msg == null) ? "valid" : msg);

        } else if (uri.equals("/analyze")){
            // e.g., /analyze?plugin=0?p0=sometext&p1=...
            // parameters should be valid, otherwise throw exception

            int pluginId = Integer.parseInt(params.get("plugin"));
            List<String> pluginParameters = new ArrayList<>();
            for (int i = 0; i < params.size() - 1; i++) {
                pluginParameters.add(params.get("p" + Integer.toString(i)));
            }
            String text = dataPlugins.get(pluginId).getText(pluginParameters);

            return newFixedLengthResponse(analyzer.getEntitiesJSON(text));
        }
        return newFixedLengthResponse("404");
    }

    /**
     * Load plugins listed in META-INF/services/...
     *
     * @return List of instantiated plugins
     */
    private static List<DataPlugin> loadPlugins() {
        ServiceLoader<DataPlugin> plugins = ServiceLoader.load(DataPlugin.class);
        List<DataPlugin> result = new ArrayList<>();
        for (DataPlugin plugin : plugins) {
            System.out.println("Loaded plugin " + plugin.getPluginName());
            result.add(plugin);
        }
        return result;
    }
}

