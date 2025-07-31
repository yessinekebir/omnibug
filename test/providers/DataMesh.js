import test from 'ava';

import DataMeshProvider from '../source/providers/DataMesh.js';

test('pattern should match DataMesh URLs', t => {
    let provider = new DataMeshProvider();
    t.true(provider.checkUrl('https://example.com/html-event-tracks/component-displayed-tracks'));
    t.true(provider.checkUrl('https://example.com/html-event-tracks/html-element-clicked-tracks'));
    t.false(provider.checkUrl('https://example.com/other-url'));
});

test('should parse component-displayed-tracks event', t => {
    let provider = new DataMeshProvider();
    let url = 'https://example.com/html-event-tracks/component-displayed-tracks';
    let postData = '{"componentId":"test-component"}';
    let data = provider.parseUrl(url, postData);
    let eventValue = data.data.find(d => d.key === 'eventValue');
    t.is(data.provider.name, 'DataMesh Display');
    t.is(eventValue.value, 'test-component');
});

test('should parse html-element-clicked-tracks event', t => {
    let provider = new DataMeshProvider();
    let url = 'https://example.com/html-event-tracks/html-element-clicked-tracks';
    let postData = '{"htmlElementId":"test-element"}';
    let data = provider.parseUrl(url, postData);
    let eventValue = data.data.find(d => d.key === 'eventValue');
    t.is(data.provider.name, 'DataMesh Click');
    t.is(eventValue.value, 'test-element');
});
