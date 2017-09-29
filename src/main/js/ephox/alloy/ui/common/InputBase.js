define(
  'ephox.alloy.ui.common.InputBase',

  [
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.api.behaviour.Focusing',
    'ephox.alloy.api.behaviour.Representing',
    'ephox.alloy.api.component.SketchBehaviours',
    'ephox.alloy.data.Fields',
    'ephox.boulder.api.FieldSchema',
    'ephox.boulder.api.Objects',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Merger',
    'ephox.sugar.api.properties.Value'
  ],

  function (Behaviour, Focusing, Representing, SketchBehaviours, Fields, FieldSchema, Objects, Fun, Merger, Value) {

    var schema = [
      FieldSchema.option('data'),
      FieldSchema.defaulted('inputAttributes', { }),
      FieldSchema.defaulted('inputStyles', { }),
      FieldSchema.defaulted('type', 'input'),
      FieldSchema.defaulted('tag', 'input'),
      FieldSchema.defaulted('inputClasses', [ ]),
      Fields.onHandler('onSetValue'),
      FieldSchema.defaulted('styles', { }),
      FieldSchema.option('placeholder'),
      FieldSchema.defaulted('eventOrder', { }),
      SketchBehaviours.field('inputBehaviours', [ Representing, Focusing ]),
      FieldSchema.defaulted('selectOnFocus', true)
    ];

    var behaviours = function (detail) {
      return Merger.deepMerge(
        Behaviour.derive([
          Representing.config({
            store: {
              mode: 'manual',
              // Propagating its Option
              initialValue: detail.data().getOr(undefined),
              getValue: function (input) {
                return Value.get(input.element());
              },
              setValue: function (input, data) {
                var current = Value.get(input.element());
                // Only set it if it has changed ... otherwise the cursor goes to the end.
                if (current !== data) {
                  Value.set(input.element(), data);
                }
              }
            },
            onSetValue: detail.onSetValue()
          }),
          Focusing.config({
            onFocus: detail.selectOnFocus() === false ? Fun.noop : function (component) {
              var input = component.element();
              var value = Value.get(input);
              input.dom().setSelectionRange(0, value.length);
            }
          })
        ]),
        SketchBehaviours.get(detail.inputBehaviours())
      );
    };

    var dom = function (detail) {
      return {
        tag: detail.tag(),
        attributes: Merger.deepMerge(
          Objects.wrapAll([
            {
              key: 'type',
              value: detail.type()
            }
          ].concat(detail.placeholder().map(function (pc) {
            return {
              key: 'placeholder',
              value: pc
            };
          }).toArray())),
          detail.inputAttributes()
        ),
        styles: detail.inputStyles(),
        classes: detail.inputClasses()
      };
    };

    return {
      schema: Fun.constant(schema),
      behaviours: behaviours,
      dom: dom
    };
  }
);