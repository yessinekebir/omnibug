/* exported DatameshProvider */
class DatameshProvider extends BaseProvider {

    constructor() {
        super();
        this._key = "DATAMESH";
        this._name = "Datamesh";
        this._type = "analytics";
        this._pattern = /html-event-tracks\/(component-displayed-tracks|html-element-clicked-tracks)/;
    }

    /**
     * Retrieve the column mappings for default columns (account, event type)
     *
     * @return {{}}
     */
    get columnMapping()
    {
        return {
            "account": "componentId",
            "requestType":  "requestType"
        };
    }

    /**
     * Parse custom properties for a given URL
     *
     * @param    {object}   url
     * @param    {object}   params
     *
     * @returns {void|Array}
     */
    handleCustom(url, params) {
        let requestType = "Other",
            data = [];

        if (url.pathname.includes("html-element-clicked-tracks")) {
            requestType = "Click";
        } else if (url.pathname.includes("component-displayed-tracks")) {
            requestType = "Display";
        }

        let componentId = params.get("htmlElementId") || params.get("componentId");
        let version = params.get("microFrontendVersion");

        data.push({
            "key": "requestType",
            "value": requestType,
            "field": "Request Type"
        });

        if (componentId) {
            data.push({
                "key": "componentId",
                "field": "Component ID",
                "value": componentId,
                "group": "general"
            });
        }

        if (version) {
            data.push({
                "key": "microFrontendVersion",
                "field": "Version",
                "value": version,
                "group": "general"
            });
        }

        // The base provider will handle the rest of the parameters, so we don't need to loop through them here.
        // We just need to return the custom data we've extracted.
        return data;
    }
}
