import { serial as test } from 'ava';
import store from './dist/ost';

test.beforeEach(t => {
  t.context.store = store({ user: {
    name: 'peter',
    surname: 'pan',
    friends: ['hans', 'paul', 'peter']
  }});
});


test('.set() called with a string as key and a second argument for the value', t => {
  t.context.store.set('string', 'isset');
  // t.context.store.set('baz.boo', true);
  t.is(t.context.store.get('string'), 'isset');
  // t.is(t.context.store.get('baz.boo'), true);
});


test('.set() called with one string of dot seperated keys and anargument for the value', t => {
  t.context.store.set('deep.obj.note', 'done');
  // t.context.store.set('baz.boo', true);
  t.is(t.context.store.get('deep.obj.note'), 'done');
  // t.is(t.context.store.get('baz.boo'), true);
});



test('.set() a flat key value object - and .get() the value by key', t => {
  t.context.store.set({ peter: 'pan' });
  // t.context.store.set('baz.boo', true);
  t.is(t.context.store.get('peter'), 'pan');
  // t.is(t.context.store.get('baz.boo'), true);
});


test('.push() a value to array - and .get() the value by key', t => {
  t.context.store.push('user.friends', 'foo');
  // t.context.store.set('baz.boo', true);
  t.is(t.context.store.get('user.friends.3'), 'foo');
  // t.is(t.context.store.get('baz.boo'), true);
});

test('.insert() a value to array - and .get() the value by key', t => {
  t.context.store.insert('user.friends', 'bar', 2);
  // t.context.store.set('baz.boo', true);
  t.is(t.context.store.get('user.friends.2'), 'bar');
  // t.is(t.context.store.get('baz.boo'), true);
});


test('.empty() an array', t => {
  t.context.store.empty('user.friends');
  // t.context.store.set('baz.boo', true);
  t.is(t.context.store.get('user.friends').length, 0);
  // t.is(t.context.store.get('baz.boo'), true);
});

test('.empty() an object', t => {
  t.context.store.empty('user');
  // t.context.store.set('baz.boo', true);
  t.is(Object.keys(t.context.store.get('user')).length, 0);
  // t.is(t.context.store.get('baz.boo'), true);
});



test('.set() nested object and .get() values with dot notation', t => {
  t.context.store.set({
    foo1: 'bar1',
    foo2: 'bar2',
    baz: {
      boo: 'foo',
      foo: {
        bar: 'baz'
      }
    }
  });
  t.is(t.context.store.get('foo1'), 'bar1');
  t.is(t.context.store.get('foo2'), 'bar2');
  t.deepEqual(t.context.store.get('baz'), {
    boo: 'foo',
    foo: {
      bar: 'baz'
    }
  });
  t.is(t.context.store.get('baz.boo'), 'foo');
  t.deepEqual(t.context.store.get('baz.foo'), {bar: 'baz'});
  t.is(t.context.store.get('baz.foo.bar'), 'baz');
});


test('.subscribe() to a nested key by dot notation and get event when its changed by .set()', t => {


  const unsubscribe = t.context.store.subscribe('user.surname', (evt) => {
    const {type, key, value, state} = evt;
    t.is(type, 'user.surname');
    t.is(value, 'panic');

    unsubscribe();
  })

  t.context.store.set('user.surname', 'panic');
  t.is(t.context.store.get('user.surname'), 'panic');

  // t.context.store.set({ peter: 'panic' });

});



test('add another store to the actual one', t => {

  const initialState ={
    name: 'myStore',
    active: false,
    details: {
      some: 'thing'
    }
  };
  const newStore = store(initialState);


  t.context.store.set('newStore', newStore);
  t.deepEqual(t.context.store.get('newStore').getState(), initialState);
});




test('subscribe to a key of a nested store through the main store by dot notation and set the value by dot notation through the main store', t => {

  const initialState ={
    name: 'myStore',
    active: false,
    details: {
      some: 'thing'
    }
  };
  const newStore = store(initialState);

  let event;
  t.context.store.set('newStore', newStore);


  t.context.store.subscribe('newStore.name', (e) => {
    event = e;
  });

  t.context.store.set('newStore.name', 'mystore');

  t.is(event.type, 'newStore.name');
  t.is(event.value, 'mystore');
});




// test('subscribe to a key of a nested store and set the value by dot notation through the main store', t => {

//   const initialState ={
//     name: 'myStore',
//     active: false,
//     details: {
//       some: 'thing'
//     }
//   };
//   const newStore = store(initialState);
//   let event;

//   t.context.store.set('newStore', newStore);
//   // t.deepEqual(t.context.store.get('newStore').getState(), initialState);

//   newStore.subscribe('name', (e) => {
//     event = e;
//     t.is(e.type, 'name');
//     t.is(e.value, 'mystore');
//   });

//   t.context.store.set('newStore.name', 'mystore');
//   // newStore.set('name', 'mystore');


//   t.is(event.type, 'name');
//   t.is(event.value, 'mystore');

// });







// test('.has()', t => {
//   t.context.store.set('foo', '🦄');
//   t.context.store.set('baz.boo', '🦄');
//   t.true(t.context.store.has('foo'));
//   t.true(t.context.store.has('baz.boo'));
//   t.false(t.context.store.has('missing'));
// });
// test('.delete()', t => {
//   t.context.store.set('foo', 'bar');
//   t.context.store.set('baz.boo', true);
//   t.context.store.set('baz.foo.bar', 'baz');
//   t.context.store.delete('foo');
//   t.not(t.context.store.get('foo'), 'bar');
//   t.context.store.delete('baz.boo');
//   t.not(t.context.store.get('baz.boo'), true);
//   t.context.store.delete('baz.foo');
//   t.not(t.context.store.get('baz.foo'), {bar: 'baz'});
//   t.context.store.set('foo.bar.baz', {awesome: 'icecream'});
//   t.context.store.set('foo.bar.zoo', {awesome: 'redpanda'});
//   t.context.store.delete('foo.bar.baz');
//   t.is(t.context.store.get('foo.bar.zoo.awesome'), 'redpanda');
// });
// test('.clear()', t => {
//   t.context.store.set('foo', 'bar');
//   t.context.store.set('foo1', 'bar1');
//   t.context.store.set('baz.boo', true);
//   t.context.store.clear();
//   t.is(t.context.store.size, 0);
// });
// test('.all', t => {
//   t.context.store.set('foo', 'bar');
//   t.context.store.set('baz.boo', true);
//   t.is(t.context.store.all.foo, 'bar');
//   t.deepEqual(t.context.store.all.baz, {boo: true});
// });
// test('.size', t => {
//   t.context.store.set('foo', 'bar');
//   t.is(t.context.store.size, 1);
// });
// test('.path', t => {
//   t.context.store.set('foo', 'bar');
//   t.true(fs.existsSync(t.context.store.path));
// });
// test('use default value', t => {
//   const conf = new Configstore('configstore-test', {foo: 'bar'});
//   t.is(conf.get('foo'), 'bar');
// });
// test('support global namespace path option', t => {
//   const conf = new Configstore('configstore-test', {}, {globalConfigPath: true});
//   const regex = /configstore-test(\/|\\)config.json$/;
//   t.true(regex.test(conf.path));
// });
// test('ensure `.all` is always an object', t => {
//   fs.unlinkSync(configstorePath);
//   t.notThrows(() => t.context.store.get('foo'));
// });
