(function() {

    describe('ngDroplet', function() {

        beforeEach(module('ngDroplet'));

        // Mock the "File" object for testing purposes.
        window.File = function(name, type, size) {
            this.name = name;
            this.type = type;
            this.size = size;
        };

        var mockFileModel = new File('Mock.png', 'image/png', 200);

        /**
         * @method compileDirective
         * @param html {String}
         * @param [properties={}] {Object}
         * @return {Object}
         */
        var compileDirective = function compileDirective(html, properties) {

            var scope, document = '';

            inject(function inject($rootScope, $compile) {

                scope = $rootScope.$new();

                for (var property in properties || {}) {

                    if (properties.hasOwnProperty(property)) {
                        scope[property] = properties[property];
                    }

                }

                document = $compile(html)(scope);

            });

            return { scope: scope.$$childHead, html: document };

        };

        it('Should be able to define the DropletModel blueprint;', function() {

            var scope = compileDirective('<droplet></droplet>').scope;

            expect(scope.DropletModel).toBeDefined();
            expect(typeof scope.DropletModel.prototype.load).toBe('function');
            expect(typeof scope.DropletModel.prototype.deleteFile).toBe('function');
            expect(typeof scope.DropletModel.prototype.isImage).toBe('function');

            var model = new scope.DropletModel();
            model.load(mockFileModel);
            model.setType(scope.FILE_TYPES.VALID);

            expect(model.file).toEqual(mockFileModel);
            expect(model.type).toEqual(scope.FILE_TYPES.VALID);
            expect(model.mimeType).toEqual('image/png');
            expect(model.extension).toEqual('png');

        });

        it('Should be able to unset the variables when finished loading;', function() {

            var scope = compileDirective('<droplet></droplet>').scope;

            scope.progress    = { percent: 100, total: 140, loaded: 140 };
            scope.isUploading = true;
            scope.finishedUploading();

            expect(scope.progress.percent).toEqual(0);
            expect(scope.progress.total).toEqual(0);
            expect(scope.progress.loaded).toEqual(0);
            expect(scope.isUploading).toBeFalsy();

        });

        it('Should be able to iterate over a given file type;', function() {

            var scope = compileDirective('<droplet></droplet>').scope;

            scope.addFile(mockFileModel, scope.FILE_TYPES.VALID);
            scope.addFile(mockFileModel, scope.FILE_TYPES.VALID);
            scope.addFile(mockFileModel, scope.FILE_TYPES.VALID);

            var Callback = {
                Function: function callbackFn(file) {
                    expect(file instanceof scope.DropletModel).toBeTruthy();
                }
            };

            spyOn(Callback, 'Function').andCallThrough();
            scope.forEachFile(scope.FILE_TYPES.VALID, Callback.Function);
            expect(Callback.Function).toHaveBeenCalled();
            expect(Callback.Function.calls.length).toEqual(3);

        });

        it('Should be able to add a file and filter of any given type;', function() {

            var scope = compileDirective('<droplet></droplet>').scope;
            scope.addFile(mockFileModel, scope.FILE_TYPES.INVALID);
            scope.addFile(mockFileModel, scope.FILE_TYPES.VALID);
            scope.addFile(mockFileModel, scope.FILE_TYPES.VALID);
            scope.addFile(mockFileModel, scope.FILE_TYPES.UPLOADED);

            expect(scope.files.length).toEqual(4);
            expect(scope.filterFiles(scope.FILE_TYPES.INVALID).length).toEqual(1);
            expect(scope.filterFiles(scope.FILE_TYPES.VALID).length).toEqual(2);
            expect(scope.filterFiles(scope.FILE_TYPES.UPLOADED).length).toEqual(1);

        });

        it('Should be able to delete files directly via the model;', function() {

            var scope = compileDirective('<droplet></droplet>').scope,
                firstModel = scope.addFile(mockFileModel, scope.FILE_TYPES.VALID),
                secondModel = scope.addFile(mockFileModel, scope.FILE_TYPES.VALID);

            expect(scope.filterFiles(scope.FILE_TYPES.VALID).length).toEqual(2);
            firstModel.deleteFile();
            expect(scope.filterFiles(scope.FILE_TYPES.VALID).length).toEqual(1);
            expect(scope.filterFiles(scope.FILE_TYPES.DELETED).length).toEqual(1);
            secondModel.deleteFile();
            expect(scope.filterFiles(scope.FILE_TYPES.VALID).length).toEqual(0);
            expect(scope.filterFiles(scope.FILE_TYPES.DELETED).length).toEqual(2);

        });

        it('Should be able to retrieve the extension for any given file;', function() {

            var scope = compileDirective('<droplet></droplet>').scope;
            expect(scope.getExtension({ name: 'Image.png' })).toEqual('png');
            expect(scope.getExtension({ name: 'Image.JPEG' })).toEqual('jpeg');
            expect(scope.getExtension({ name: '' })).toEqual('');
            expect(scope.getExtension({ name: '.torrent' })).toEqual('torrent');
            expect(scope.getExtension({ name: 'None' })).toEqual('');

        });

        it('Should be able to traverse the files;', function() {

            var scope = compileDirective('<droplet></droplet>').scope,
                invalidMockFileModel = new File('Mock.pdf', 'application/pdf', 200),
                files = [mockFileModel, mockFileModel, mockFileModel, mockFileModel, invalidMockFileModel];

            scope.options.extensions = ['png'];
            scope.traverseFiles(files);

            expect(scope.files.length).toEqual(5);
            expect(scope.filterFiles(scope.FILE_TYPES.VALID).length).toEqual(4);
            expect(scope.filterFiles(scope.FILE_TYPES.INVALID).length).toEqual(1);
            expect(scope.files[0] instanceof scope.DropletModel).toBeTruthy();

        });

        it('Should be able to add parameters to the XMLHttpRequest object;', function() {

            var MockXMLHttpRequest = function() {

                this.setRequestHeader = function(property, value) {
                    this[property] = value;
                }

            };

            var scope = compileDirective('<droplet></droplet>').scope,
                xmlHttpRequest = new MockXMLHttpRequest();

            scope.options.requestHeaders = { exampleHeader: 'okay', andAnotherHeader: 'sunshine' };
            var data = scope.addRequestHeaders(xmlHttpRequest);

            expect(data[0]).toEqual('exampleHeader');
            expect(data[1]).toEqual('andAnotherHeader');

            expect(xmlHttpRequest.exampleHeader).toEqual('okay');
            expect(xmlHttpRequest.andAnotherHeader).toEqual('sunshine');

        });

        it('Should be able to add parameters to the FormData object;', function() {

            var MockFormData = function() {

                this.append = function(property, value) {
                    this[property] = value;
                }

            };

            var scope = compileDirective('<droplet></droplet>').scope,
                formData = new MockFormData();

            scope.options.requestPostData = { morePost: 'everything', dataToCome: 'is', okay: 'okay!' };
            var data = scope.addPostData(formData);

            expect(data[0]).toEqual('morePost');
            expect(data[1]).toEqual('dataToCome');
            expect(data[2]).toEqual('okay');

            expect(formData.morePost).toEqual('everything');
            expect(formData.dataToCome).toEqual('is');
            expect(formData.okay).toEqual('okay!');

        });

        it('Should be able to compute the length of the request;', function() {

            var scope = compileDirective('<droplet></droplet>').scope,
                files = [];

            files.push(scope.addFile(mockFileModel));
            files.push(scope.addFile(mockFileModel));
            files.push(scope.addFile(mockFileModel));

            expect(scope.getRequestLength()).toEqual(600);
            expect(scope.getRequestLength(files)).toEqual(600);

        });

        it('Should be able to determine valid extensions and HTTP status codes;', function() {

            var scope = compileDirective('<droplet></droplet>').scope;

            scope.options.statuses.success = [200, 201, 202, /3.+/];
            expect(scope.isValidHTTPStatus(203)).toBeFalsy();
            expect(scope.isValidHTTPStatus(200)).toBeTruthy();
            expect(scope.isValidHTTPStatus(305)).toBeTruthy();

            scope.options.extensions = ['jpg', 'PNG', /g[a-z]{2}/i];
            expect(scope.isValidExtension('png')).toBeTruthy();
            expect(scope.isValidExtension('jpg')).toBeTruthy();
            expect(scope.isValidExtension('JPG')).toBeTruthy();
            expect(scope.isValidExtension('gif')).toBeTruthy();
            expect(scope.isValidExtension('exe')).toBeFalsy();
            expect(scope.isValidExtension('pdf')).toBeFalsy();

        });

        it('Should be able to return the correct event, even when jQuery is used;', function() {

            var scope           = compileDirective('<droplet></droplet>').scope,
                MockNativeEvent = function MockNativeEvent() {},
                MockJQueryEvent = function MockJQueryEvent() { this.originalEvent = new MockNativeEvent() };

            expect(scope.getEvent(new MockNativeEvent()) instanceof MockNativeEvent).toBeTruthy();
            expect(scope.getEvent(new MockJQueryEvent()) instanceof MockNativeEvent).toBeTruthy();

        });

        it('Should be able to add the files when an item is dropped;', function() {

            var directive = compileDirective('<droplet ng-model="mockModel"></droplet>', { mockModel: {} }),
                event     = document.createEvent('Event');

            event.initEvent('drop', true, true);
            event.dataTransfer = { files: [mockFileModel] };
            directive.scope.options.extensions = ['png'];

            directive.html[0].dispatchEvent(event);
            expect(directive.scope.files.length).toEqual(1);
            expect(directive.scope.filterFiles(directive.scope.FILE_TYPES.VALID).length).toEqual(1);

        });

        it('Should be able to reject files when the limit has been exceeded;', function() {

            var scope = compileDirective('<droplet></droplet>').scope;

            scope.options.maximumValidFiles = 2;
            scope.options.extensions        = ['png'];
            scope.traverseFiles([mockFileModel, mockFileModel, mockFileModel]);

            expect(scope.filterFiles(scope.FILE_TYPES.VALID).length).toEqual(2);
            expect(scope.filterFiles(scope.FILE_TYPES.INVALID).length).toEqual(1);

        });

        it('Should be able to define a FILE_TYPES.ALL option;', function() {

            var scope = compileDirective('<droplet></droplet>').scope,
                FT    = scope.FILE_TYPES;

            expect(FT.ALL).toEqual(FT.VALID | FT.INVALID | FT.DELETED | FT.UPLOADED | FT.FAILED);

        });

    });

})();