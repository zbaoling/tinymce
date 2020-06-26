import { Element, Focus } from '@ephox/sugar';
import { Fun } from '@ephox/katamari';

import * as Clicks from '../mouse/Clicks';
import { Chain } from './Chain';
import * as UiFinder from './UiFinder';

// Custom event creation
const cClickWith = Fun.compose(Chain.op, Clicks.click);
const cContextMenuWith = Fun.compose(Chain.op, Clicks.contextMenu);
const cMouseOverWith = Fun.compose(Chain.op, Clicks.mouseOver);
const cMouseDownWith = Fun.compose(Chain.op, Clicks.mouseDown);
const cMouseUpWith = Fun.compose(Chain.op, Clicks.mouseUp);
const cMouseMoveWith = Fun.compose(Chain.op, Clicks.mouseMove);
const cMouseOutWith = Fun.compose(Chain.op, Clicks.mouseOut);

// With delta position (shifted relative to top-left of component)
/**
 * @deprecated */
const cMouseUpTo = (dx: number, dy: number) => cMouseUpWith({ dx, dy });
/**
 * @deprecated */
const cMouseMoveTo = (dx: number, dy: number) => cMouseMoveWith({ dx, dy });

// No extra settings
/**
 * @deprecated */
const cClick = cClickWith({ });
/**
 * @deprecated */
const cContextMenu = cContextMenuWith({ });
/**
 * @deprecated */
const cMouseOver = cMouseOverWith({ });
/**
 * @deprecated */
const cMouseDown = cMouseDownWith({ });
/**
 * @deprecated */
const cMouseUp = cMouseUpWith({ });
/**
 * @deprecated */
const cMouseMove = cMouseMoveWith({ });
/**
 * @deprecated */
const cMouseOut = cMouseOutWith({ });

// Work with selectors
const sTriggerOn = <T>(container: Element, selector: string, action: (ele: Element) => void) =>
  Chain.asStep<T, Element>(container, [ Chain.async<Element, Element>((container, next, die) => {
    UiFinder.findIn(container, selector).fold(
      () => die('Could not find element: ' + selector),
      (ele) => {
        action(ele);
        next(container);
      }
    );
  }) ]);

const sClickOn = <T>(container: Element, selector: string) => sTriggerOn<T>(container, selector, Clicks.trigger);

const sHoverOn = <T>(container: Element, selector: string) =>
  sTriggerOn<T>(container, selector, Clicks.mouseOver({ }));

const sContextMenuOn = <T>(container: Element, selector: string) =>
  sTriggerOn<T>(container, selector, Clicks.contextMenu({ }));

const cClickOn = (selector: string): Chain<Element, Element> => Chain.fromIsolatedChains([
  UiFinder.cFindIn(selector),
  cClick
]);

// True click utilities: mouse down / mouse up / click events all in one
const trueClick = (elem: Element) => {
  // The closest event queue to a true Click
  Focus.focus(elem);
  Clicks.mouseDown({ })(elem);
  Clicks.mouseUp({ })(elem);
  Clicks.trigger(elem);
};
const cTrueClick = Chain.op(trueClick);
const sTrueClickOn = <T>(container: Element, selector: string) => sTriggerOn<T>(container, selector, trueClick);

// Low level exports
const button = Clicks.button;
const buttons = Clicks.buttons;
/**
 * Use event instead.
 * @deprecated */
const point = Clicks.point;
const event = Clicks.event;

export {
  cClickWith,
  cContextMenuWith,
  cMouseOverWith,
  cMouseDownWith,
  cMouseUpWith,
  cMouseMoveWith,
  cMouseOutWith,

  cClick,
  cContextMenu,
  cMouseOver,
  cMouseDown,
  cMouseUp,
  cMouseMove,
  cMouseOut,

  cMouseUpTo,
  cMouseMoveTo,

  sClickOn,
  sHoverOn,
  sContextMenuOn,
  cClickOn,

  cTrueClick,
  sTrueClickOn,

  button,
  buttons,
  point,
  event
};
