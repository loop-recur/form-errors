function FormError(field, message){
  if(this instanceof FormError){
    if(field && message) {
      this[field] = [message];
    }
  } else {
    return new FormError(field, message);
  }
};

FormError.prototype.concat = function(other){
  var aggregated = new FormError();
  for(var key in this) {
    if(this.hasOwnProperty(key)) {
      aggregated[key] = this[key];
    }
  }
  for(var key in other) {
    if(other.hasOwnProperty(key)) {
      var val = aggregated[key], errs = other[key];
      aggregated[key] = val ? val.concat(errs) : errs;
    }
  }
  return aggregated;
};

FormError.id = FormError.prototype.id = new FormError();
FormError.empty = FormError.prototype.empty = FormError;
FormError.fromObject = function(obj){
  var err = new FormError;
  for(var key in obj){
    if(obj.hasOwnProperty(key)) {
      err[key] = obj[key];
    }
  }
  return err;
}

module.exports = FormError;
