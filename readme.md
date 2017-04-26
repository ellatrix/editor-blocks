# Editor Blocks Prototype (with a Single `contenteditable` Instance)

## Registering a block

```js
wp.blocks.registerBlock( {
  name: String, // Name of the block.
  namespace: String, // Namespace the block belongs to. Usually this is the plugin name.
  displayName: String, // Human readable form of `name`. Should be translated.
  icon: String, // Gridicon ID.
  type: String, // Section to show the block in (e.g. `text`).
  keywords: Array, // Keywords to search.
  getProps: ( vNode: VNode, helpers: Object ) => ( props: Object ), // Extracts properties from a VNode with helpers.
  render: ( props: Object ) => ( vNode: VNode ), // Creates a VNode to render in the editor given properties.
  save: ( props: Object ) => ( vNode: VNode ), // Creates a VNode to save given properties. Optional. Falls back to `render`.
  controls: Array(
    {
      icon: String, // Gridicon ID.
      props: Object // Properties to apply to the block on click.
    }
  )
} );
```

Examples: https://github.com/iseulde/editor-blocks/tree/master/blocks

The following special attributes can be used on elements:

```js
{
  'data-editable': Boolean, // Disable or enable editing of the element contents.
  'data-enter': Boolean, // Disable or enable enter (return) behaviour within an editable zone.
  'placeholder': String, // Shows when the editable element is empty.
  'onClick': ( props: Object, callback: () => ( props: Object ) ) => () // Called when the element is clicked.
}
```

## How does it all work?

### State

The state of the editor is stored in a JSON tree. This tree includes the content, more specifically all the elements, stored as arrays. Example: `[ 'p', attributes, ...children ]`. It also includes the selection, stored as an array of indices which create a path to the start and end of the selection.

The state tree is kept in sync by listening to events that are emitted when the editor DOM is manipulated. The state tree can also be changed (with Redux' actions and reducers concept), and the editor DOM will partially be rerendered where necessary.

```
Click
↓
Render is called with new props
↓
Action is disptached
↓
Reducer applies action to global state tree
↓
State tree (store) is updated
↓
Change in store is observed
↓
UI (e.g. active button) and editor DOM update
```

```
Browser changes the editor DOM (at the request of the user)
↓
TinyMCE helps to normalise this `contenteditable` behaviour
↓
Change in DOM (event) is observed
↓
Action is disptached
↓
Reducer applies action to global state tree
↓
State tree (store) is updated
↓
Change is observed
↓
UI (e.g. active button) updates
```

## UI

The TinyMCE UI framework was used for quick development, and is still, but this can easily be changed to React or something plain. UI components must listen to the Redux store. This could be done with the `wp.storeHelpers.observeStore` helper.




