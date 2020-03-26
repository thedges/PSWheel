({
    jsLoaded: function (component, event, helper) {
        var globalId = component.getGlobalId();

        console.log('globalId=' + globalId);

    
		var nodes = new vis.DataSet([]);
		var edges = new vis.DataSet([]);

        // provide the data in the vis format
        var data = {
            nodes: nodes,
            edges: edges
        };

        var container = document.getElementById(globalId + '_network');

        var options = {
            autoResize: true,
            height: '100%',
            width: '100%',
            physics: {
                enabled: true
            },
            edges: {
                color: {
                    color:'#848484',
                    highlight:'#848484',
                    hover: '#848484',
                    inherit: 'from',
                    opacity:1.0
                  },
                  length: 200
            },
			layout: {
				randomSeed: 1
            },
            nodes: {
                widthConstraint: 150
            }
        };

        // initialize your network!
        var network = new vis.Network(container, data, options);

        network.on('doubleClick', $A.getCallback(function (properties) {
            console.log('clicked node ' + properties.nodes);

            if (properties.nodes != 1) 
            {
                var wheelData = component.get("v.wheelData");
                
				for (var index = 0; index < wheelData.items.length; index++) {
                    //console.log('node = ' + JSON.stringify(wheelData.items[index]));
                    
					if (properties.nodes == index + 2 && wheelData.items[index].status == 'active')
					{
                        console.log('navigate to record ' + wheelData.items[index].recordId);
                        var sObjectEvent = $A.get("e.force:navigateToSObject");
                        sObjectEvent.setParams({
                         "recordId": wheelData.items[index].recordId,
                         "slideDevName": "detail"
                        });
                        sObjectEvent.fire();
						break;
                    }
                    
                }
    
            }
            
		}));
		
		component.set("v.network", network);

		helper.getProgramWheel(component);
    },
    destroyCmp: function (component, event, helper) {
        component.destroy();
    },
    refresh: function (component, event, helper) {
        console.log('refresh invokved...');

        var network = component.get('v.network');
        network.setOptions ({
            nodes: {
              fixed: false,
            },
          });
          
        helper.getProgramWheel(component);
    }
})