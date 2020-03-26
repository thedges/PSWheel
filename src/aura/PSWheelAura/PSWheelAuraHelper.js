({
  getProgramWheel: function (component) {
    var self = this;

    try {
      var action = component.get ('c.getWheelConfig');
      action.setParams ({
        recordId: component.get ('v.recordId'),
        templateName: component.get ('v.templateName'),
      });

      action.setCallback (this, function (a) {
        var state = a.getState ();

        if (state === 'SUCCESS') {
          console.log ('response=' + a.getReturnValue ());

          var wheelData = JSON.parse (a.getReturnValue ());
          console.log ('wheelData=' + JSON.stringify (wheelData));
          component.set ('v.wheelData', wheelData);

          var nodeList = [];
          var edgeList = [];

          ///////////////////////
          // setup center node //
          ///////////////////////
          var node = {};
          node['id'] = 1;
          node['label'] = wheelData.centerLabel;
          node['shape'] = 'circularImage';
          node['size'] = 50;
          node['image'] = wheelData.centerImage;
          nodeList.push (node);

          console.log ('items=' + JSON.stringify (wheelData.items));

          ////////////////////////////
          // setup wheel edge nodes //
          ////////////////////////////
          for (var index = 0; index < wheelData.items.length; index++) {
            node = {};

            var edge = {};

            node['id'] = index + 2;
            if (wheelData.items[index].showLabel) {
              node['label'] = wheelData.items[index].label;
            } else {
              node['label'] = wheelData.items[index].label;
            }
            node['shape'] = 'circularImage';

            node['size'] = 40;

            node['image'] = wheelData.items[index].image;

            if (
              wheelData.items[index].hoverText != null &&
              wheelData.items[index].hoverText.length > 0
            ) {
              node['title'] = wheelData.items[index].hoverText;
            }

            node['borderWidth'] = 0;
            node['recordId'] = wheelData.items[index].recordId;

            edge['from'] = 1;
            edge['to'] = index + 2;
            edgeList.push (edge);

            nodeList.push (node);
          }

          var nodes = new vis.DataSet (nodeList);

          // create an array with edges
          var edges = new vis.DataSet (edgeList);

          // provide the data in the vis format
          var data = {
            nodes: nodes,
            edges: edges,
          };

          console.log ('data=' + JSON.stringify (data));

          var network = component.get ('v.network');
          network.setData (data);
          network.focus (1, {scale: 0.7});
          network.redraw ();

          setTimeout (function () {
            console.log ('Disable dragging of the nodes...');
            network.setOptions ({
              nodes: {
                fixed: true,
              },
            });
            console.log ('done setting global options');
          }, 1000);
        } else {
          self.handleErrors (component, a.getError ());
        }
      });
      $A.enqueueAction (action);
    } catch (err) {
      self.handleErrors (component, err.message);
    }
  },
  showSpinner: function (component) {
    component.set ('v.IsSpinner', true);
  },
  hideSpinner: function (component) {
    component.set ('v.IsSpinner', false);
  },
  handleErrors: function (component, errors) {
    // Configure error toast
    let toastParams = {
      title: 'Error!',
      message: 'Unknown error', // Default error message
      type: 'error',
      mode: 'sticky',
    };
    // Pass the error message if any
    if (errors && Array.isArray (errors) && errors.length > 0) {
      toastParams.message = errors[0].message;
    } else {
      toastParams.message = errors;
    }
    // Fire error toast
    let toastEvent = $A.get ('e.force:showToast');
    toastEvent.setParams (toastParams);
    toastEvent.fire ();
  },
});