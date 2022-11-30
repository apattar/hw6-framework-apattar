import VisualizationPlugin from './plugininterface'

class TestVisualizationPlugin implements VisualizationPlugin {
    getParameterMessages(): string[] {
        return ["Fun little message"];
    }
    getInvalidMessage(parameters: string[]): string | null {
        if (parameters.length !== 1) return "Invalid number of parameters.";
        else return null;
    }
    getPluginName(): string {
        return "Test Visualization Plugin"
    }
    getChartNode(data: any, params: string[]): Node {
        return document.createTextNode("" + data);
    }
}

export default TestVisualizationPlugin