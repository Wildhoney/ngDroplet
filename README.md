# ngDroplet

The [original Droplet module](https://github.com/Wildhoney/EmberDroplet) was created by me for Ember.js &ndash; `ngDroplet` is the Angular.js version. `ngDroplet` allows you to easily support drag and drop uploading in Angular.js &ndash; with additional sugar for uploading and managing files.

![Travis](http://img.shields.io/travis/Wildhoney/ngDroplet.svg?style=flat)
&nbsp;
![npm](http://img.shields.io/npm/v/ng-droplet.svg?style=flat)
&nbsp;
![License MIT](http://img.shields.io/badge/License-MIT-lightgrey.svg?style=flat)
&nbsp;
![IE10+](http://img.shields.io/badge/support-IE10-blue.svg?style=flat)

* **Heroku**: [http://ng-droplet.herokuapp.com/](http://ng-droplet.herokuapp.com/)
* **Bower:** `bower install ng-droplet`

![ngDroplet Screenshot](http://i.imgur.com/ORaiV2l.jpg)

---

## Getting Started

`ngDroplet` provides a useful interface with a handful of methods to interact with the module. However, to begin supporting the drag and drop feature, you don't need anything special &ndash; simply add the `droplet` node (or `droplet` attribute) to the DOM:

```html
<!-- As an element -->
<droplet></droplet>

<!-- As an attribute -->
<section data-droplet></section>
```

By adding the `droplet` node &mdash; or of course, attribute &mdash; your application will automatically support the dragging and dropping of files. However, in order to make the module useful, you should hook into the directive's interface &ndash; by using the `ng-model` attribute on the `droplet` node:

```html
<droplet ng-model="interface"></droplet>
```

In the above case, the `interface` references a variable in your current scope. Once `ngDroplet` has successfully bootstrapped itself, you can begin interacting with the module through its interface. Before you begin invoking methods on the interface, you must first listen for `ngDroplet` to broadcast the `$dropletReady` event:

```javascript
$scope.$on('$dropletReady', function whenDropletReady() {
    // Directive's interface is ready to be used...
});
```

With the directive's interface there are [many methods](#interface-methods) you can invoke. Initially you'll want to define which extensions are permitted to be uploaded by the module &ndash; you can do achieve this via the `allowedExtensions` method:

```javascript
$scope.$on('$dropletReady', function whenDropletReady() {
    $scope.interface.allowedExtensions(['png', 'jpg', 'bmp', 'gif']);
});
```

...Or support every extension with:

```javascript
$scope.interface.allowedExtensions([/.+/]);
```

Finally you'll need to add a button to initiate the upload process:

```html
<input type="button" value="Upload Files" ng-click="interface.uploadFiles()"/>
```

**Voila!**

## File Iteration

With all the files that the user drops onto the DOM, you'll most likely wish to display them &ndash; even showing a [preview of any images](#image-previews) they have added.

It's necessary to know that each file has a special type assigned to it, and you will need to know these types when iterating over the files &ndash; all of the possible types are added to the directive's interface as the `FILE_TYPES` constant:

```javascript
$scope.FILE_TYPES = { VALID: 1, INVALID: 2, DELETED: 4, UPLOADED: 8 };
```

**Note:** `ngDroplet` also defines a `FILE_TYPES.ALL` property.

Therefore to iterate over **only** the valid files that are permitted to be uploaded, you must use the `FILE_TYPES.VALID` constant when invoking the `getFiles` methods on the interface:

```html
<div ng-repeat="model in interface.getFiles(interface.FILE_TYPES.VALID)">
    {{model.file.name}}
</div>
```

As the `interface.FILE_TYPES` are bitwise values, you can combine them to fetch more than one type at a time &mdash; in the following case `interface.FILE_TYPES.VALID` and `interface.FILE_TYPES.INVALID`:

```javascript
interface.getFiles(interface.FILE_TYPES.VALID | interface.FILE_TYPES.INVALID)
```

It's also worth noting that if you emit any type when invoking `getFiles` then the method will return **all** of the files.

### File Model

Before you begin iterating of the files it is perhaps necessary to know about the `DropletModel` which is assigned to each and every file added to `ngDroplet` &ndash; the `DropletModel` model is initiated using the `load` method:

```javascript
load: function load(file) {

    this.file      = file;
    this.date      = new $window.Date();
    this.mimeType  = file.type;
    this.extension = $scope.getExtension(file);

}
```

Each `DropletModel` is then assigned a type:

```javascript
setType: function setType(type) {
    this.type = type;
}

// ...
                        
model.setType($scope.FILE_TYPES.VALID);
```

Where the parameter &mdash; `type` &mdash; relates to the aforementioned `FILE_TYPES` constant. `DropletModel` also contains a handful of useful methods:

* `deleteFile`: Assign the file the `FILE_TYPES.DELETED` value;
* `isImage`: Determines if the file is a valid image;
* `setType`: Sets the type (`$scope.FILE_TYPES`) of the file;

### Image Previews

`ngDroplet` also supports the previewing of valid images to the user prior to the files being uploaded &ndash; before attempting to preview a file you should first determine if it's a valid image using the `isImage` method on the `DropletModel`:

```html
<div ng-repeat="model in interface.getFiles(interface.FILE_TYPES.VALID)">

    <droplet-preview ng-model="model" ng-show="model.isImage()"></droplet-preview>
    <section class="filename" ng-show="!model.isImage()">{{model.file.name}}</section>
    
</div>
```

It's also worth noting that the `droplet-preview` directive is also supported in attribute form: `<section data-droplet-preview></section>`.

Essentially the `droplet-preview` node accepts **any** `File` object as its `ng-model` &ndash; but it will load **only** those files that pass the `isImage()` method's validation.

## Input Elements

Due to the directive's interface you can attach an `input` element that will allow users to add files in the traditional way &ndash; `ngDroplet` also supports `input` elements with the `multiple` attribute. All you need to do is attach the `interface` variable to the `ng-model` attribute:

```html
<!-- Single -->
<droplet-upload-single ng-model="interface"></droplet-upload-single>

<!-- Multiple -->
<droplet-upload-multiple ng-model="interface"></droplet-upload-multiple>
```

## Upload Progress

`ngDroplet` uses the `X-File-Size` header to calculate the progress of the uploading &ndash; all of the information is periodically updated to the `interface.progress` object in the following format:

```javascript
$scope.requestProgress = { percent: 0, total: 0, loaded: 0 };
```

With the above object you can merely print it to the screen like so: `{{interface.progress.percent}}%` &ndash; or dream up imaginative ways to use this useful information.

## Interface Methods

* `uploadFiles`: Responsible for initiating the uploading process;
* `progress`: Contains an object referring to the upload progress;
* `isUploading`: Determines if we're currently uploading;
* `isError`: Determines if there is an error;
* `isReady`: Determines if there are files ready to be uploaded;
* `addFile`: Adds a file to the list &ndash; must be a `File` object;
* `traverseFiles`: Accepts a `FileList` object for adding many files;
* `disableXFileSize`: Disables adding the `X-File-Size` header;
* `useArray`: Whether to use **file** of **file[]** as the POST name;
* `setRequestUrl`: Defines the URL to issue the POST request to;
* `setRequestHeaders`: Set additional request headers;
* `setPostData`: Set additional POST data;
* `getFiles`: Iterates over the files of any given bitwise type(s);
* `allowedExtensions`: Specifies the extensions permitted to be uploaded;
* `defineHTTPSuccess`: List of HTTP status codes that denote success;
* `useParser`: Configure a custom function for parsing the responses;
* `maximumValidFiles`: Defines how many valid files are permitted at once;

### Custom Parser Function

By default `ngDroplet` will attempt to parse the response as JSON, however if you want to use a custom function then you can set it using the `interface.options.useParser` method:

```javascript
interface.useParser(function myCustomerParserFn(responseText) {
    return responseText.toLowerCase();
});
```

### HTTP Success w/ Regex

HTTP status codes can also be defined using regular expressions &ndash; all that you need to do is pass in `RegExp` objects in the array of status codes.

For example to assert that every `2**` HTTP status code is valid, you can specify it like so:

```javascript
interface.defineHTTPSuccess([/2.{2}/]);
```

You are also allowed to mix and match `RegExp` objects with `Number` objects:

```javascript
interface.defineHTTPSuccess([/2.{2}/, 301, 302]);
```

## Broadcasted Events

* `$dropletReady`: Emitted when the interface has been binded;
* `$dropletSuccess`: Emitted when files have been uploaded;
* `$dropletError`: Emitted when an error has occurred;
* `$dropletFileAdded`: Emitted when a file has been added;
* `$dropletFileDeleted`: Emitted when a file has been deleted;