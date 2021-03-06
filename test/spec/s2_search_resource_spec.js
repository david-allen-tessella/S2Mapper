define([
  'resource_test_helper',
  'config',
  'mapper/s2_root',
  'mapper/s2_search_resource',
  'text!json/unit/root.json',
  'text!json/unit/searching.json'
], function (TestHelper, config, Root, SearchResource, rootData, searchData) {
  'use strict';

  TestHelper(function (results) {
    describe("SearchResource", function () {
      results.lifeCycle();

      var s2, handler;

      beforeEach(function () {
        runs(function () {
          config.loadTestData(rootData);
          Root.load({user:"username"})
              .then(results.assignTo('root'))
              .then(function () {
                s2 = results.get('root');
                return s2.searches.handling(s2.batches);
              })
              .then(function (ret) {
                handler = ret;
                config.cummulativeLoadingTestDataInFirstStage(searchData)})
              .then(results.expected)
              .fail(results.unexpected);
        });
        waitsFor(results.hasFinished);
      });

      describe('handling resource', function () {
        describe('first', function () {
          it('returns the first page of results', function () {
            results.reset();

            runs(function(){
              handler.first({})
                  .then(results.assignTo('results'))
                  .then(results.expected)
                  .fail(results.unexpected);
            });

            waitsFor(results.hasFinished);

            runs(function(){
              expect(results.get('results')[0].name).toBe('first page');
            });
          });
        });

        describe('last', function () {
          it('returns the last page of results', function () {

            results.reset();

            runs(function(){
              handler.last({})
                  .then(results.assignTo('results'))
                  .then(results.expected)
                  .fail(results.unexpected);
            });

            waitsFor(results.hasFinished);

            runs(function(){
              expect(results.get('results')[0].name).toBe('last page');
            });
          });
        });
      });
    });
  });
});
