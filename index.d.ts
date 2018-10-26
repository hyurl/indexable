declare global {
    interface SymbolConstructor {
        indexer: symbol;
    }
}

export const indexer: symbol;

export interface indexableTarget {
    [Symbol.indexer]: () => {
        get?: (this: any, index: number) => any;
        set?: (this: any, index: number, value: any) => void;
    }
}

/**
 * @example
 *  var obj = indexable({
 *      [Symbol.indexer]() {
 *          get: (target, prop) => {
 *              // return something
 *          },
 *          set: (target, index, value) => {
 *              // set something
 *          }
 *      }
 *  });
 */
export function indexable<T extends indexableTarget>(obj: T): T & ArrayLike<any>;

/**
 * @example
 *  class indexableClass {
 *      [Symbol.indexer]() {
 *          return {
 *              get: (target, index) => {
 *                  // return something
 *              },
 *              set: (target, index, value) => {
 *                  // set something
 *              }
 *          }
 *      }
 *  }
 *  indexableClass = indexable(indexableClass);
 */
export function indexable<T extends indexableTarget>(Class: new (...args) => T): new (...args) => (T & ArrayLike<any>);

export default indexable;