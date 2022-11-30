package edu.cmu.cs214.hw6.framework;

import java.util.List;

public interface DataPlugin {
    
    /**
     * Gets the name of this data plugin.
     * @return this data plugin's name
     */
    String getPluginName();

    /**
     * Returns a list of names of parameters for this plugin.
     * Plugins can accept any number of text parameters, which the
     * users will enter into the GUI. The messages returned by this
     * function will be shown to the user as prompts when they
     * enter parameters for this plugin.
     * 
     * @return list of parameter names for this plugin
     */
    List<String> getParameterMessages();

    /**
     * Returns null if given parameter values are valid, or a message to show user otherwise.
     * If the parameters are invalid, the returned message will be shown
     * to the user, and they'll be prompted to re-enter the parameters.
     * 
     * @param parameters the parameter values to be judged
     * @return null if parameters are valid, a message to show user otherwise
     */
    String getInvalidMessage(List<String> parameters);

    /**
     * Given a set of valid parameters, returns text to analyze.
     * 
     * @requires getInvalidMessage(parameters) == null
     * @param parameters the valid parameters to use
     * @return the text that the framework will analyze
     */
    String getText(List<String> parameters);

}
