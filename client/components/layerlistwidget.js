import {useState, useEffect} from 'react'
import {loadModules} from '@esri/react-arcgis'

const LayerListWidget = props => {
  const [widget, setWidget] = useState(null)
  useEffect(() => {
    loadModules([
      'esri/widgets/LayerList',
      'esri/widgets/Expand',
      'esri/widgets/Locate',
      'esri/core/watchUtils',
      'esri/widgets/Legend'
    ])
      .then(([LayerList, Expand, Locate, watchUtils, Legend]) => {
        props.view.when(function() {
          var layerList = new LayerList({
            view: props.view
          })
          var expand = new Expand({
            view: props.view,
            content: layerList
          })
          setWidget(expand)
          props.view.ui.add(expand, 'top-right')
          var locateBtn = new Locate({
            view: props.view
          })
          props.view.ui.add(locateBtn, {
            position: 'top-left'
          })

          props.view.ui.add(
            new Legend({
              view: props.view
            }),
            'bottom-left'
          )

          const sampleInstructions = document.createElement('div')
          sampleInstructions.style.padding = '10px'
          sampleInstructions.style.backgroundColor = 'white'
          sampleInstructions.style.width = '300px'
          sampleInstructions.innerText = [
            'As you zoom in, the style will switch from a',
            'heatmap to individual points.'
          ].join(' ')

          const instructionsExpand = new Expand({
            expandIconClass: 'esri-icon-question',
            expandTooltip: 'How to use this sample',
            expanded: true,
            view: props.view,
            content: sampleInstructions
          })
          props.view.ui.add(instructionsExpand, 'top-left')

          // Hide the instructions when the user starts interacting with the sample

          watchUtils.whenTrueOnce(props.view, 'interacting', function() {
            instructionsExpand.expanded = false
          })
        })
      })
      .catch(err => console.error(err))
  }, [])
  return null
}

export default LayerListWidget
