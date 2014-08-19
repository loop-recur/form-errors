var assert = require('chai').assert;
var _ = require('lodash');
var claire = require('claire');
var gens = claire.data;
var FormError = require('../form_error');

var propGen = claire.choice('field1', 'field2', 'field3', 'field4', 'field5');
var singleErrGen = claire.transform(
  function(vals){return FormError.apply(null, vals) },
  claire.sequence(propGen, gens.Str)
);
var manyErrGen = claire.transform(
  function(errs){
    return errs.reduce(function(a, b){return a.concat(b)}, FormError.id);
  },
  claire.sized(function(){return 10}, claire.repeat(singleErrGen))
);

describe('FormError', function(){
  describe('fromObject', function(){
    it('produces a FormError with the same attributes',
      claire.forAll(
        claire.sized(function(){return 10}, gens.Object(gens.Array(gens.Str)))
      ).satisfy(function(obj){
        var err = FormError.fromObject(obj);
        assert.instanceOf(err, FormError);
        Object.keys(obj).forEach(function(k){
          assert.sameMembers(err[k], obj[k]);
        });
        return true;
      }).asTest()
    )
  });

  describe('concat', function(){
    it('has a left identity',
      claire.forAll(manyErrGen).satisfy(function(err){
        assert.deepEqual(FormError.empty().concat(err), err);
        return true;
      }).asTest()
    );

    it('has a right identity',
      claire.forAll(manyErrGen).satisfy(function(err){
        assert.deepEqual(err.concat(FormError.empty()), err);
        return true;
      }).asTest()
    );

    it('is associative',
      claire.forAll(manyErrGen, manyErrGen, manyErrGen).satisfy(function(e1, e2, e3){
        assert.deepEqual(e1.concat(e2.concat(e3)), e1.concat(e2).concat(e3));
        return true;
      }).asTest()
    );

    it('unions the error properties',
      claire.forAll(manyErrGen, manyErrGen).satisfy(function(e1, e2){
        assert.sameMembers(
          Object.keys(e1.concat(e2)),
          _.union(Object.keys(e1), Object.keys(e2))
        );
        return true;
      }).asTest()
    );

    it('concats colliding field messages',
      claire.forAll(manyErrGen, manyErrGen).satisfy(function(e1, e2){
        var catted = e1.concat(e2);
        Object.keys(catted).forEach(function(k){
          var expected = (e1.hasOwnProperty(k) ? e1[k] : []).concat(
            e2.hasOwnProperty(k) ? e2[k] : []
          );
          assert.deepEqual(catted[k], expected, k);
        });
        return true;
      }).asTest()
    );
  });
});
