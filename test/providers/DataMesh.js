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
    let url = 'https://www.mydomain.es/travel/html-event-tracks/component-displayed-tracks';
    let postData = '{"visitId":"239184528595","searchId":"65882002583","href":"https://www.mydomain.es/travel/accommodation/hotel_results/checkIn=2025-08-08;checkOut=2025-08-10;geoNodeId=9820;room0Adults=2","browserTimestamp":1754036769401,"microFrontendName":"mfe-accommodation-funnel","microFrontendVersion":"2.66.0","componentId":"accommodation-accommodation-card_129769","pageRenderId":"278e7680-6eb1-11f0-b1c1-810f6fff291b"}';
    let data = provider.parseUrl(url, postData);
    let eventValue = data.data.find(d => d.key === 'eventValue');
    t.is(data.provider.name, 'DataMesh Display');
    t.is(eventValue.value, 'accommodation-accommodation-card_129769');
});

test('should parse html-element-clicked-tracks event', t => {
    let provider = new DataMeshProvider();
    let url = 'https://www.mydomain.es/travel/html-event-tracks/html-element-clicked-tracks';
    let postData = '{"visitId":"239184528595","searchId":"65882002583","href":"https://www.mydomain.es/travel/accommodation/hotel_results/checkIn=2025-08-08;checkOut=2025-08-10;geoNodeId=9820;room0Adults=2","browserTimestamp":1754036772611,"microFrontendName":"mfe-accommodation-funnel","microFrontendVersion":"2.66.0","htmlElementId":"userAuthentication-google-one-tap-skipped","pageRenderId":"278e7680-6eb1-11f0-b1c1-810f6fff291b"}';
    let data = provider.parseUrl(url, postData);
    let eventValue = data.data.find(d => d.key === 'eventValue');
    t.is(data.provider.name, 'DataMesh Click');
    t.is(eventValue.value, 'userAuthentication-google-one-tap-skipped');
});
