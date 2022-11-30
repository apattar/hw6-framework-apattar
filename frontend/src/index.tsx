import './index.css'
import visualizationPlugins from './plugins/all'
import { renderPluginGui, dataOptionInputs, visualizationOptionInputs } from './plugingui'

renderPluginGui()

const errorMsg = document.getElementById('error-message') as HTMLElement
const output = document.getElementById('output') as HTMLElement
const loading = document.getElementById('loading') as HTMLElement

(document.getElementById('go') as HTMLElement).onclick = async function () {
  loading.classList.remove('hidden')
  errorMsg.innerHTML = ''

  // make sure plugins are chosen
  const dataActive = Array.from(document.getElementsByClassName('data-active'))
  const visualizationActive =
    Array.from(document.getElementsByClassName('visualization-active'))
  if (dataActive.length !== 1 || visualizationActive.length !== 1) {
    errorMsg.innerHTML = 'Please choose both a data plugin and a visualization plugin.'
    loading.classList.add('hidden')
    return
  }

  // check validity of parameters
  if ((dataOptionInputs.concat(visualizationOptionInputs)).some((input) => input.value.length === 0)) {
    errorMsg.innerHTML = 'Please enter a value for all parameters.'
    loading.classList.add('hidden')
    return
  }

  const dataPluginId = (dataActive[0] as HTMLElement).dataset.id as string
  const dataParameterString = dataOptionInputs.map(
    (input, idx) => 'p' + idx.toString() + '=' + input.value
  ).reduce((s1: string, s2: string) => s1 + '&' + s2)
  const response = await fetch('/plugin-options-valid?plugin=' + dataPluginId + '&' + dataParameterString)
  const json = await response.json()
  if (json !== 'valid') {
    errorMsg.innerHTML = 'Data plugin parameters invalid: ' + (json as string)
    loading.classList.add('hidden')
    return
  }
  const visualizationPluginId = (visualizationActive[0] as HTMLElement).dataset.id
  const visualizationParameters = visualizationOptionInputs.map((input) => input.value)
  const currVisualizationPlugin = visualizationPlugins[parseInt(visualizationPluginId as string)]
  const visErrorMsg = currVisualizationPlugin.getInvalidMessage(visualizationParameters)
  if (visErrorMsg !== null) {
    errorMsg.innerHTML = 'Visualization plugin parameters invalid: ' + visErrorMsg
    loading.classList.add('hidden')
    return
  }

  // if everything is valid, create and display output
  const textResponse = await fetch('/text?plugin=' + dataPluginId + '&' + dataParameterString)
  const text = await textResponse.json()
  const analysisResponse = await fetch('/analyze?plugin=' + dataPluginId + '&' + dataParameterString)
  const analysis = await analysisResponse.json()
  while (output.firstChild !== null) output.removeChild(output.firstChild)
  output.appendChild(
    currVisualizationPlugin.getChartNode(text, analysis, visualizationParameters)
  )

  loading.classList.add('hidden')
}
