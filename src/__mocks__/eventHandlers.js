/* eslint-disable no-empty-function */

export const documentEvents = {
  onClick: function documentOnClick() {}
};

export const rootEvents = {
  onClick: function rootOnClick() {},
  onChange: function rootOnChange() {}
};

export const node1Events = {
  onClick: function node1OnClick() {},
  onKeyDown: function node1OnKeyDown() {}
};

export const node2Events = {
  onClick: function node2OnClick() {}
};

export const node3Events = {
  onKeyDown: function node3OnKeyDown() {},
  onKeyUp: function node3OnKeyUp() {}
};

export const dummyEventHandlers = [
  {
    document: true,
    onClick: documentEvents.onClick
  },
  {
    root: true,
    onClick: rootEvents.onClick,
    onChange: rootEvents.onChange
  },
  {
    id: 'node1',
    onClick: node1Events.onClick,
    onKeyDown: node1Events.onKeyDown
  },
  {
    id: 'node2',
    onClick: node2Events.onClick,
    otherOption: 'abc',
    callback: () => 'I should be removed'
  },
  {
    id: 'node3',
    onKeyDown: node3Events.onKeyDown,
    onKeyUp: node3Events.onKeyUp,
    otherOption: 'def'
  }
];
