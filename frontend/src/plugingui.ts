import visualizationPlugins from './plugins/all'

let dataOptionInputs: HTMLInputElement[] = [];
let visualizationOptionInputs: HTMLInputElement[] = [];

const dataPluginsList: HTMLElement = document.getElementById("data-plugins-list")!;
const dataPluginsOptions: HTMLElement = document.getElementById("data-plugins-options")!;
const visualizationPluginsList: HTMLElement = document.getElementById("visualization-plugins-list")!;
const visualizationPluginsOptions: HTMLElement = document.getElementById("visualization-plugins-options")!;

async function renderDataPlugins() {
    const response = await fetch("get-plugins");
    const pluginNames = await response.json();
    console.log(pluginNames);

    pluginNames.forEach((pluginName: string, idx: number) => {
        const pluginButton = document.createElement("button");
        pluginButton.innerHTML = pluginName;
        pluginButton.onclick = () => { renderDataPluginOptions(idx) }
        dataPluginsList.appendChild(pluginButton);
    })
}

async function renderDataPluginOptions(pluginId: number) {
    const response = await fetch("get-plugin-options?plugin=" + pluginId);
    const optionNames = await response.json();

    optionNames.forEach((optionName: string) => {
        const label = document.createElement("label");
        label.innerHTML = optionName
        const input = document.createElement("input");
        input.type = "text";
        dataOptionInputs.push(input);
        label.appendChild(input);
        dataPluginsOptions.appendChild(label);
    })
}

function renderVisualizationPlugins() {
    visualizationPlugins.forEach((plugin) => {
        const pluginButton = document.createElement("button");
        pluginButton.innerHTML = plugin.getPluginName();
        pluginButton.onclick = () => {
            renderVisualizationPluginOptions(plugin.getParameterMessages())
        }
        visualizationPluginsList.appendChild(pluginButton);
    })
}

function renderVisualizationPluginOptions(optionNames: string[]) {
    optionNames.forEach((optionName) => {
        const label = document.createElement("label");
        label.innerHTML = optionName
        const input = document.createElement("input");
        input.type = "text";
        visualizationOptionInputs.push(input);
        label.appendChild(input);
        visualizationPluginsOptions.appendChild(label);
    })
}

function renderPluginGui() {
    renderDataPlugins();
    renderVisualizationPlugins();
}

export { renderPluginGui, dataOptionInputs, visualizationOptionInputs }