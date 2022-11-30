interface VisualizationPlugin {
    getPluginName(): string,
    getChartNode(text: string, data: any, params: string[]): Node,
    getParameterMessages(): string[],
    getInvalidMessage(parameters: string[]): string | null,
}

export default VisualizationPlugin