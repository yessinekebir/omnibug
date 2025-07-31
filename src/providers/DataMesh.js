/**
 * DataMesh
 *
 * @class
 * @extends BaseProvider
 */
class DataMeshProvider extends BaseProvider
{
    constructor()
    {
        super();
        this._key        = "DATAMESH";
        this._pattern    = /html-event-tracks\/(component-displayed-tracks|html-element-clicked-tracks)/;
        this._name       = "DataMesh";
        this._type       = "analytics";
        this._keywords   = [];
    }

    /**
     * Retrieve the column mappings for default columns (account, event type)
     *
     * @return {{}}
     */
    get columnMapping()
    {
        return {
            "account":      "",
            "requestType":  "Event Type"
        };
    }

    /**
     * Retrieve the group names & order
     *
     * @returns {*[]}
     */
    get groups()
    {
        return [
            {
                "key": "general",
                "name": "General"
            }
        ];
    }

    /**
     * Get all of the available URL parameter keys
     *
     * @returns {{}}
     */
    get keys()
    {
        return {};
    }

    /**
     * Parse custom properties for a given URL
     *
     * @param    {object}   url
     * @param    {object}   params
     *
     * @returns {Array}
     */
    handleCustom(url, params)
    {
        let results = [],
            path = url.pathname.split("/");

        let eventName = path.find((val) => {
            return val.includes("-tracks");
        });

        if(eventName) {
            results.push({
                "key":   "eventName",
                "field": "Event Type",
                "value": eventName.replace("-tracks", ""),
                "group": "general"
            });
        }
        return results;
    }
}
