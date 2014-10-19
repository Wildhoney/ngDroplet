# ngDroplet

[Original Droplet module](https://github.com/Wildhoney/EmberDroplet) was created by me for Ember.js &ndash; `ngDroplet` is the Angular.js version. `ngDroplet` allows you to easily support drag and drop uploading in Angular.js &ndash; with additional sugar for uploading and managing files.

![Travis](http://img.shields.io/travis/Wildhoney/ngDroplet.svg?style=flat)
&nbsp;
![npm](http://img.shields.io/npm/v/ng-droplet.svg?style=flat)
&nbsp;
![License MIT](http://img.shields.io/badge/License-MIT-lightgrey.svg?style=flat)

* **Heroku**: [http://ng-droplet.herokuapp.com/](http://ng-droplet.herokuapp.com/)
* **Bower:** `bower install ng-droplet`

![ngDroplet Screenshot](http://i.imgur.com/Ldev5gl.png)

---

## Getting Started

`ngDroplet` provides a useful interface with a handful of methods to interact with the module. However, to begin supporting the drag and drop feature, you don't need anything special &ndash; simply add the `droplet` node (or `droplet` attribute) to the DOM:

```html
<droplet></droplet>
```

By adding the `droplet` node your application will automatically support the dragging and dropping of files. However, in order to make the module useful, you should hook into the directive's interface &ndash; by using the `ng-model` attribute on the `droplet` node:

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

Therefore to iterate over **only** the valid files that are permitted to be uploaded, you must use the `FILE_TYPES.VALID` constant when invoking the `getFiles` methods on the interface:

```html
<div ng-repeat="model in interface.getFiles(interface.FILE_TYPES.VALID)">
    {{model.name}}
</div>
```

### File Model

Before you begin iterating of the files it is perhaps necessary to know about the `DropletModel` which is assigned to each and every file added to `ngDroplet` &ndash; the `DropletModel` model is initiated using the `load` method:

```javascript
load: function load(file, type) {

    this.file      = file;
    this.type      = type;
    this.date      = new $window.Date();
    this.mimeType  = file.type;
    this.extension = $scope.getExtension(file);

}
```

Where the second parameter &mdash; `type` &mdash; relates to the aforementioned `FILE_TYPES` constant. `DropletModel` also contains a handful of useful methods:

* `deleteFile`: Assign the file the `FILE_TYPES.DELETED` value;
* `isImage`: Determines if the file is a valid image;

### Image Previews

`ngDroplet` also supports the previewing of valid images to the user prior to the files being uploaded &ndash; before attempting to preview a file you should first determine if it's a valid image using the `isImage` method on the `DropletModel`:

```html
<div ng-repeat="model in interface.getFiles(interface.FILE_TYPES.VALID)">

    <droplet-preview ng-model="model" ng-show="model.isImage()"></droplet-preview>
    <section class="filename" ng-show="!model.isImage()">{{model.name}}</section>
    
</div>
```

Essentially the `droplet-preview` node accepts **any** `File` object as its `ng-model` &ndash; but it will load **only** those files that pass the `isImage()` method's validation.

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

## Broadcasted Events

* `$dropletReady`: Emitted when the interface has been binded;
* `$dropletSuccess`: Emitted when files have been uploaded;
* `$dropletError`: Emitted when an error has occurred;