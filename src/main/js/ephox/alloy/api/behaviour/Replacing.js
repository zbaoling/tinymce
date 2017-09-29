define(
  'ephox.alloy.api.behaviour.Replacing',

  [
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.behaviour.replacing.ReplaceApis'
  ],

  function (Behaviour, ReplaceApis) {
    return Behaviour.create({
      fields: [ ],
      name: 'replacing',
      apis: ReplaceApis
    });
  }
);