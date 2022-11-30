import visualizationPlugins from './plugins/all'

let dataOptionInputs: HTMLInputElement[] = []
let visualizationOptionInputs: HTMLInputElement[] = []

const dataPluginsList: HTMLElement = document.getElementById('data-plugins-list') as HTMLElement
const dataPluginsOptions: HTMLElement = document.getElementById('data-plugins-options') as HTMLElement
const visualizationPluginsList: HTMLElement = document.getElementById('visualization-plugins-list') as HTMLElement
const visualizationPluginsOptions: HTMLElement = document.getElementById('visualization-plugins-options') as HTMLElement

function removeAllChildren (node: HTMLElement): void {
  while (node.firstChild !== null) {
    node.removeChild(node.firstChild)
  }
}

async function renderDataPlugins (): Promise<void> {
  removeAllChildren(dataPluginsList)

  const response = await fetch('get-plugins')
  const pluginNames = await response.json()
  console.log(pluginNames)

  pluginNames.forEach((pluginName: string, idx: number) => {
    const pluginButton = document.createElement('button')
    pluginButton.innerHTML = pluginName
    pluginButton.dataset.id = idx.toString()
    pluginButton.onclick = async () => {
      Array.from(document.getElementsByClassName('data-active'))
        .forEach((elt) => { elt.classList.remove('data-active') })
      pluginButton.classList.add('data-active')
      await renderDataPluginOptions(idx)
    }
    dataPluginsList.appendChild(pluginButton)
  })
}

async function renderDataPluginOptions (pluginId: number): Promise<void> {
  removeAllChildren(dataPluginsOptions)
  dataOptionInputs = []
  const response = await fetch('get-plugin-options?plugin=' + pluginId.toString())
  const optionNames = await response.json()

  optionNames.forEach((optionName: string) => {
    const label = document.createElement('label')
    label.innerHTML = optionName + '\t'
    const input = document.createElement('input')
    input.type = 'text'
    dataOptionInputs.push(input)
    label.appendChild(input)
    dataPluginsOptions.appendChild(label)
  })
}

function renderVisualizationPlugins (): void {
  removeAllChildren(visualizationPluginsList)
  visualizationPlugins.forEach((plugin, idx) => {
    const pluginButton = document.createElement('button')
    pluginButton.innerHTML = plugin.getPluginName()
    pluginButton.dataset.id = idx.toString()
    pluginButton.onclick = () => {
      Array.from(document.getElementsByClassName('visualization-active'))
        .forEach((elt) => { elt.classList.remove('visualization-active') })
      pluginButton.classList.add('visualization-active')
      renderVisualizationPluginOptions(plugin.getParameterMessages())
    }
    visualizationPluginsList.appendChild(pluginButton)
  })
}

function renderVisualizationPluginOptions (optionNames: string[]): void {
  removeAllChildren(visualizationPluginsOptions)
  visualizationOptionInputs = []
  optionNames.forEach((optionName) => {
    const label = document.createElement('label')
    label.innerHTML = optionName + '\t'
    const input = document.createElement('input')
    input.type = 'text'
    visualizationOptionInputs.push(input)
    label.appendChild(input)
    visualizationPluginsOptions.appendChild(label)
  })
}

function renderPluginGui (): void {
  void Promise.all([renderDataPlugins(), renderVisualizationPlugins()])
}

export { renderPluginGui, dataOptionInputs, visualizationOptionInputs }
