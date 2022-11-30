interface VisualizationPlugin {
    /* Return the name of the plugin. */
    getPluginName(): string,

    /* Return a list of names for parameters to this plugin. */
    getParameterMessages(): string[],

    /* Given a list of parameters, return null if they're valid, or
     * a message to show to the user if they're invalid. */
    getInvalidMessage(parameters: string[]): string | null,
    
    /* Given the text that's been analyzed, the entity analysis data
     * extracted by the framework (see README), and any parameters,
     * return the Node element containing the visualization. It will
     * be added to the page. */
    getChartNode(text: string, data: any, params: string[]): Node,
}

export default VisualizationPlugin