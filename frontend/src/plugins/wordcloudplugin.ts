import VisualizationPlugin from './plugininterface'
import WordCloud from 'wordcloud'

class WordCloudVisualizationPlugin implements VisualizationPlugin {
  getParameterMessages (): string[] {
    return [] // TODO?
  }

  getInvalidMessage (parameters: string[]): string | null {
    if (parameters.length !== 0) return 'Invalid number of parameters.'
    else return null
  }

  getPluginName (): string {
    return 'Word Cloud Plugin'
  }

  getChartNode (text: string, data: any, params: string[]): Node {
    const options: any = []
    Object.keys(data).forEach((entityType) => {
      Object.keys(data[entityType]).forEach((entityText) => {
        options.push([entityText, data[entityType][entityText].length * 40])
      })
    })

    const canvas = document.createElement('canvas')
    canvas.width *= 3
    canvas.height *= 3

    // canvas.style.width = "30rem";
    // canvas.style.height = "30rem";
    WordCloud(canvas, {
      list: options,
      backgroundColor: 'beige'
    })
    return canvas
  }
}

export default WordCloudVisualizationPlugin
