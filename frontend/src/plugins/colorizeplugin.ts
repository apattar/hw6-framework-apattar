import VisualizationPlugin from './plugininterface'

class ColorizeVisualizationPlugin implements VisualizationPlugin {
    getParameterMessages(): string[] {
        return [];
    }
    getInvalidMessage(parameters: string[]): string | null {
        if (parameters.length !== 0) return "Invalid number of parameters.";
        else return null;
    }
    getPluginName(): string {
        return "Colorizer Plugin"
    }
    getChartNode(text: string, data: any, params: string[]): Node {
        let resultNode = document.createElement("div");
        let colors = ["black", "navy", "olive", "grey", "maroon", "brown", "teal", "red", "orange", "green", "blue", "purple"];

        interface Op {
            location: number,
            len: number,
            color: string
        }

        let ops: Op[] = []
        let entityColors = document.createElement("div")
        let entityColorsHeader = document.createElement("strong");
        entityColorsHeader.innerHTML = "Entity types found:";
        entityColors.appendChild(entityColorsHeader);
        entityColors.appendChild(document.createElement("br"))

        Object.keys(data).forEach((entityType) => {
            // pick a unique color
            let color = colors.pop() as string;

            entityColors.appendChild(document.createTextNode(entityType + ": "))
            let colorNode = document.createElement("strong")
            colorNode.innerHTML = color
            colorNode.style.color = color
            entityColors.appendChild(colorNode);
            entityColors.appendChild(document.createElement("br"));

            Object.keys(data[entityType]).forEach((entityText: string) => {
                let mentions: number[] = data[entityType][entityText];
                mentions.forEach((mention) => {
                    ops.push({
                        location: mention,
                        len: entityText.length,
                        color: color,
                    })
                })
            })
        })
        let intCompare = (x: number, y: number) => {
            if (x < y) return -1;
            if (x > y) return 1;
            else return 0
        }
        ops.sort((a,b) => intCompare(a.location, b.location));

        resultNode.appendChild(entityColors);
        resultNode.appendChild(document.createElement("br"));
        let header = document.createElement("strong");
        header.innerHTML = "Colorized text:";
        resultNode.appendChild(header);
        resultNode.appendChild(document.createElement("br"));

        let colorizedText = document.createElement("pre");
        let offset = 0;
        ops.forEach((op: Op) => {
            colorizedText.appendChild(document.createTextNode(text.slice(0, op.location - offset)))
            let mentionText = text.slice(op.location - offset, op.location + op.len - offset);
            text = text.slice(op.location + op.len - offset);
            offset += op.location + op.len - offset
            let colored = document.createElement("strong");
            colored.innerHTML = mentionText
            colored.style.color = op.color;
            colorizedText.appendChild(colored);
        })
        colorizedText.appendChild(document.createTextNode(text));

        resultNode.appendChild(colorizedText);
        return resultNode;
    }
}

export default ColorizeVisualizationPlugin