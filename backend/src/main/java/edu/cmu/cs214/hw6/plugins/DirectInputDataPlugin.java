package edu.cmu.cs214.hw6.plugins;

import java.util.List;
import edu.cmu.cs214.hw6.framework.DataPlugin;

public class DirectInputDataPlugin implements DataPlugin {

    public String getPluginName() {
        return "Direct Input Data Plugin";
    }

    public List<String> getParameterMessages() {
        return List.of("Text to analyze");
    }

    public String getInvalidMessage(List<String> parameters) {
        if (parameters.size() != 1) {
            return "Invalid number of parameters.";
        } else {
            return null;
        }
    }

    public String getText(List<String> parameters) {
        return parameters.get(0);
    }
    
}
