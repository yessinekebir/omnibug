import test from 'ava';

import DataMeshProvider from '../source/providers/DataMesh.js';

test('pattern should match DataMesh URLs', t => {
    let provider = new DataMeshProvider();
    t.true(provider.checkUrl('https://example.com/html-event-tracks/component-displayed-tracks'));
    t.true(provider.checkUrl('https://example.com/html-event-tracks/html-element-clicked-tracks'));
    t.false(provider.checkUrl('https://example.com/other-url'));
});

test('should parse event type from URL', t => {
    let provider = new DataMeshProvider();
    let url = 'https://example.com/html-event-tracks/component-displayed-tracks';
    let data = provider.parseUrl(url);
    let eventType = data.data.find(d => d.key === 'eventName');
    t.is(eventType.value, 'component-displayed');
});
