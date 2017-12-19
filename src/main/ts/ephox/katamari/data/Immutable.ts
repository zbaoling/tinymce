import Arr from '../api/Arr';
import Fun from '../api/Fun';



export default <any> function () {
  var fields = arguments;
  return function(/* values */) {
    //  Don't use array slice(arguments), makes the whole function unoptimisable on Chrome
    var values = new Array(arguments.length);
    for (var i = 0; i < values.length; i++) values[i] = arguments[i];

    if (fields.length !== values.length)
      throw new Error('Wrong number of arguments to struct. Expected "[' + fields.length + ']", got ' + values.length + ' arguments');

    var struct = {};
    Arr.each(fields, function (name, i) {
      struct[name] = Fun.constant(values[i]);
    });
    return struct;
  };
};