import { getNewEl } from './__mocks__/dom';
import { CHILD_ATTR } from './constants';

import { getEnhancedElement } from './elements';

describe('elements', () => {
  describe('getEnhancedElement', () => {
    const createEl = ({ attributes = [], content = '' } = {}) => {
      const el = getNewEl({
        tagName: 'button',
        content,
        attributes: [
          ['id', 'test-child'],
          ...attributes
        ]
      });

      document.body.appendChild(el);

      return el;
    };

    const findElInDom = () => document.querySelector('#test-child');

    beforeEach(() => {
      const testChild = findElInDom();

      if (testChild) {
        testChild.remove();
      }
    });

    it('Should return an object with the passed element as an "el" property', () => {
      const el = createEl();

      const result = getEnhancedElement(el);

      expect(result.el).toEqual(el);
    });

    it('Should return an object with the element target attribute as an "id" property', () => {
      const el = createEl({
        attributes: [
          [CHILD_ATTR, 'button1']
        ]
      });

      const result = getEnhancedElement(el);

      expect(result.id).toBe('button1');
    });

    describe('setText', () => {
      it('Should set the text content of the element', () => {
        const wrapper = getEnhancedElement(createEl());

        const result = wrapper.setText('Test text');

        expect(result.el).toHaveTextContent('Test text');
        expect(wrapper.el).toHaveTextContent('Test text');
        expect(findElInDom()).toHaveTextContent('Test text');
      });

      it('Should support chaining multiple setText calls', () => {
        const wrapper = getEnhancedElement(createEl());

        const result = wrapper
          .setText('abc')
          .setText('def')
          .setText('ghi');

        expect(wrapper.el).toHaveTextContent('ghi');
        expect(result.el).toHaveTextContent('ghi');
        expect(findElInDom()).toHaveTextContent('ghi');
      });
    });

    describe('setInnerHtml', () => {
      it('Should set the innerHTML of the element', () => {
        const wrapper = getEnhancedElement(createEl());

        const result = wrapper.setInnerHtml('<p id="test-p"></p>');

        expect(result.el.querySelector('#test-p')).toBeInTheDocument();
        expect(wrapper.el.querySelector('#test-p')).toBeInTheDocument();
        expect(document.querySelector('#test-p')).toBeInTheDocument();
      });

      it('Should support chaining multiple setInnerHtml calls', () => {
        const wrapper = getEnhancedElement(createEl());

        const result = wrapper
          .setInnerHtml('<p id="test-p-1"></p>')
          .setInnerHtml('<p id="test-p-2"></p>')
          .setInnerHtml('<p id="test-p-3"></p>');

        expect(result.el.querySelector('#test-p-3')).toBeInTheDocument();
        expect(wrapper.el.querySelector('#test-p-3')).toBeInTheDocument();
        expect(document.querySelector('#test-p-3')).toBeInTheDocument();
      });
    });

    describe('setClass', () => {
      it('Should add a new class to the element', () => {
        const wrapper = getEnhancedElement(createEl());

        const result = wrapper.setClass('test-class-1');

        expect(result.el).toHaveClass('test-class-1');
        expect(wrapper.el).toHaveClass('test-class-1');
        expect(document.querySelector('.test-class-1')).toBeInTheDocument();
      });

      it('Should add multiple new classes to the element', () => {
        const wrapper = getEnhancedElement(createEl());

        const result = wrapper.setClass('test-class-1', 'test-class-2');

        expect(result.el).toHaveClass('test-class-1');
        expect(result.el).toHaveClass('test-class-2');
        expect(document.querySelector('.test-class-1.test-class-2')).toBeInTheDocument();
      });

      it('Should not throw when invalid values are passed', () => {
        const wrapper = getEnhancedElement(createEl());

        expect(() => wrapper.setClass('', false, 0, NaN, Infinity, null, undefined)).not.toThrow();
      });

      it('Should support chaining multiple setClass calls', () => {
        const wrapper = getEnhancedElement(createEl());

        const result = wrapper
          .setClass('test-class-1')
          .setClass('test-class-2')
          .setClass('test-class-3');

        expect(result.el).toHaveClass('test-class-1');
        expect(result.el).toHaveClass('test-class-2');
        expect(result.el).toHaveClass('test-class-3');
        expect(document.querySelector('.test-class-1.test-class-2.test-class-3')).toBeInTheDocument();
      });
    });

    describe('removeClass', () => {
      it('Should remove a class from the element', () => {
        const wrapper = getEnhancedElement(createEl({
          attributes: [
            ['class', 'test-class-1']
          ]
        }));

        const result = wrapper.removeClass('test-class-1');

        expect(result.el).not.toHaveClass('test-class-1');
        expect(wrapper.el).not.toHaveClass('test-class-1');
        expect(document.querySelector('.test-class-1')).not.toBeInTheDocument();
      });

      it('Should remove multiple classes from the element', () => {
        const wrapper = getEnhancedElement(createEl({
          attributes: [
            ['class', 'test-class-1 test-class-2']
          ]
        }));

        const result = wrapper.removeClass('test-class-1', 'test-class-2');

        expect(result.el).not.toHaveClass('test-class-1');
        expect(result.el).not.toHaveClass('test-class-2');
        expect(document.querySelector('.test-class-1.test-class-2')).not.toBeInTheDocument();
      });

      it('Should not throw when invalid values are passed', () => {
        const wrapper = getEnhancedElement(createEl());

        expect(() => wrapper.removeClass('', false, 0, NaN, Infinity, null, undefined)).not.toThrow();
      });

      it('Should support chaining multiple removeClass calls', () => {
        const wrapper = getEnhancedElement(createEl({
          attributes: [
            ['class', 'test-class-1 test-class-2 test-class-3']
          ]
        }));

        const result = wrapper
          .removeClass('test-class-1')
          .removeClass('test-class-2')
          .removeClass('test-class-3');

        expect(result.el).not.toHaveClass('test-class-1');
        expect(result.el).not.toHaveClass('test-class-2');
        expect(result.el).not.toHaveClass('test-class-3');
        expect(document.querySelector('.test-class-1.test-class-2.test-class-3')).not.toBeInTheDocument();
      });
    });

    describe('setAttribute', () => {
      it('Should set the given attribute value by the passed name', () => {
        const wrapper = getEnhancedElement(createEl());

        const result = wrapper.setAttribute('data-test-attr', 'Test value');

        expect(result.el).toHaveAttribute('data-test-attr', 'Test value');
        expect(wrapper.el).toHaveAttribute('data-test-attr', 'Test value');
        expect(document.querySelector('[data-test-attr="Test value"]')).toBeInTheDocument();
      });

      it('Should support chaining multiple setAttribute calls', () => {
        const wrapper = getEnhancedElement(createEl());

        const result = wrapper
          .setAttribute('data-test-attr-1', 'Test value 1')
          .setAttribute('data-test-attr-2', 'Test value 2')
          .setAttribute('data-test-attr-3', 'Test value 3');

        expect(result.el).toHaveAttribute('data-test-attr-1', 'Test value 1');
        expect(result.el).toHaveAttribute('data-test-attr-2', 'Test value 2');
        expect(result.el).toHaveAttribute('data-test-attr-3', 'Test value 3');
        expect(document.querySelector('[data-test-attr-1][data-test-attr-2][data-test-attr-3]')).toBeInTheDocument();
      });
    });

    describe('removeAttribute', () => {
      it('Should remove the given attribute from the element', () => {
        const wrapper = getEnhancedElement(createEl({
          attributes: [
            ['data-test-attr', 'Test value']
          ]
        }));

        const result = wrapper.removeAttribute('data-test-attr');

        expect(result.el).not.toHaveAttribute('data-test-attr');
        expect(wrapper.el).not.toHaveAttribute('data-test-attr');
        expect(document.querySelector('[data-test-attr="Test value"]')).not.toBeInTheDocument();
      });

      it('Should support chaining multiple removeAttribute calls', () => {
        const wrapper = getEnhancedElement(createEl({
          attributes: [
            ['data-test-attr-1', 'Test value 1'],
            ['data-test-attr-2', 'Test value 2'],
            ['data-test-attr-3', 'Test value 3']
          ]
        }));

        const result = wrapper
          .removeAttribute('data-test-attr-1')
          .removeAttribute('data-test-attr-2')
          .removeAttribute('data-test-attr-3');

        expect(result.el).not.toHaveAttribute('data-test-attr-1');
        expect(result.el).not.toHaveAttribute('data-test-attr-2');
        expect(result.el).not.toHaveAttribute('data-test-attr-3');
        expect(
          document.querySelector('[data-test-attr-1][data-test-attr-2][data-test-attr-3]')
        ).not.toBeInTheDocument();
      });
    });

    describe('setStyle', () => {
      it('Should set the given style value by the passed name', () => {
        const wrapper = getEnhancedElement(createEl());

        wrapper.setStyle('color', 'red');

        expect(wrapper.el).toHaveStyle('color: red');
      });

      it('Should support chaining multiple setStyle calls', () => {
        const wrapper = getEnhancedElement(createEl());

        wrapper
          .setStyle('color', 'red')
          .setStyle('fontSize', '20px')
          .setStyle('fontWeight', 'bold');

        expect(wrapper.el).toHaveStyle(`
          color: red;
          font-size: 20px;
          font-weight: bold;
        `);
      });
    });

    describe('Chaining', () => {
      it('Should support chaining all setter methods together', () => {
        const wrapper = getEnhancedElement(createEl());

        wrapper
          .setText('abc')
          .setClass('test-class-1')
          .setInnerHtml('<span id="test-span"></span>')
          .setStyle('fontStyle', 'italic')
          .setAttribute('data-test-1', 'Text value 1')
          .setText('def')
          .setAttribute('data-test-2', 'Text value 2')
          .removeClass('test-class-1')
          .removeAttribute('data-test-2')
          .setClass('test-class-2');

        const el = findElInDom();

        expect(el).toHaveTextContent('def');
        expect(el).toContainHTML('');
        expect(el).not.toHaveClass('test-class-1');
        expect(el).toHaveClass('test-class-2');
        expect(el).toHaveAttribute('data-test-1', 'Text value 1');
        expect(el).not.toHaveAttribute('data-test-2');
        expect(el).toHaveStyle('font-style: italic');
      });
    });

    describe('getText', () => {
      it('Should return the element text content', () => {
        const wrapper = getEnhancedElement(createEl({
          content: 'Test text'
        }));

        expect(wrapper.getText()).toBe('Test text');
      });

      it('Should return the element text after setText', () => {
        const wrapper = getEnhancedElement(createEl());

        const result = wrapper.setText('New text').getText();

        expect(result).toBe('New text');
      });
    });

    describe('getInnerHtml', () => {
      it('Should return the element innerHTML value', () => {
        const wrapper = getEnhancedElement(createEl({
          content: '<span id="test-span"></span>'
        }));

        expect(wrapper.getInnerHtml()).toBe('<span id="test-span"></span>');
      });

      it('Should return the element innerHTML after setInnerHtml', () => {
        const wrapper = getEnhancedElement(createEl());

        const result = wrapper
          .setInnerHtml('<strong id="test-strong"></strong>')
          .getInnerHtml();

        expect(result).toBe('<strong id="test-strong"></strong>');
      });
    });

    describe('getClasses', () => {
      it('Should return an array of all classes on the element', () => {
        const wrapper = getEnhancedElement(createEl({
          attributes: [
            ['class', 'test-class-1 test-class-2 test-class-3']
          ]
        }));

        expect(wrapper.getClasses()).toEqual([
          'test-class-1',
          'test-class-2',
          'test-class-3'
        ]);
      });

      it('Should return an empty array when the element has no classes', () => {
        const wrapper = getEnhancedElement(createEl());

        expect(wrapper.getClasses()).toEqual([]);
      });

      it('Should return an array of classes after setClass', () => {
        const wrapper = getEnhancedElement(createEl());

        const result = wrapper
          .setClass('test-class-1', 'test-class-2')
          .getClasses();

        expect(result).toEqual(['test-class-1', 'test-class-2']);
      });
    });

    describe('getAttribute', () => {
      it('Should return the value of the passed attribute name', () => {
        const wrapper = getEnhancedElement(createEl({
          attributes: [
            ['data-test-attr', 'Test value']
          ]
        }));

        expect(wrapper.getAttribute('data-test-attr')).toBe('Test value');
      });

      it('Should return null when the passed attribute name does not exist', () => {
        const wrapper = getEnhancedElement(createEl());

        expect(wrapper.getAttribute('data-test-attr')).toBeNull();
      });

      it('Should return the attribute value after setAttribute', () => {
        const wrapper = getEnhancedElement(createEl());

        const result = wrapper
          .setAttribute('data-test-attr', 'Test value')
          .getAttribute('data-test-attr');

        expect(result).toBe('Test value');
      });
    });

    describe('getAttributes', () => {
      it('Should return an object of all attributes on the element', () => {
        const wrapper = getEnhancedElement(createEl({
          attributes: [
            ['data-test-attr-1', 'Test value 1'],
            ['data-test-attr-2', ''],
            ['data-test-attr-3', 'Test value 3']
          ]
        }));

        expect(wrapper.getAttributes()).toEqual({
          'id': 'test-child',
          'data-test-attr-1': 'Test value 1',
          'data-test-attr-2': '',
          'data-test-attr-3': 'Test value 3'
        });
      });

      it('Should return an empty object when the element has no attributes', () => {
        const wrapper = getEnhancedElement(
          document.createElement('span')
        );

        expect(wrapper.getAttributes()).toEqual({});
      });

      it('Should return the attribute value after setAttribute', () => {
        const wrapper = getEnhancedElement(createEl());

        const result = wrapper
          .setAttribute('data-test-attr-1', 'Test value 1')
          .setAttribute('data-test-attr-2', 'Test value 2')
          .getAttributes();

        expect(result).toEqual({
          'id': 'test-child',
          'data-test-attr-1': 'Test value 1',
          'data-test-attr-2': 'Test value 2'
        });
      });
    });

    describe('getStyle', () => {
      it('Should return the value of the given style name', () => {
        const wrapper = getEnhancedElement(createEl({
          attributes: [
            ['style', 'font-weight: bold;']
          ]
        }));

        expect(wrapper.getStyle('fontWeight')).toBe('bold');
      });

      it('Should return an empty string when the given style name does not exist on the element', () => {
        const wrapper = getEnhancedElement(createEl());

        expect(wrapper.getStyle('fontWeight')).toBe('');
      });

      it('Should return the value of a style after setStyle', () => {
        const wrapper = getEnhancedElement(createEl());

        const result = wrapper
          .setStyle('fontSize', '30px')
          .getStyle('fontSize');

        expect(result).toBe('30px');
      });
    });
  });
});
