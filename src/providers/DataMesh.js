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
            "requestType":  "Request Type"
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
     * Parse a given URL into human-readable output
     *
     * @param {string}  rawUrl      A URL to check against
     * @param {string}  postData    POST data, if applicable
     *
     * @return {{provider: {name: string, key: string, type: string}, data: Array}}
     */
    parseUrl(rawUrl, postData = "")
    {
        let url = new URL(rawUrl),
            data = [],
            params = new URLSearchParams(url.search),
            postParams = this.parsePostData(postData);

        // Handle POST data first, if applicable (treat as query params)
        postParams.forEach((pair) => {
            params.append(pair[0], pair[1]);
        });

        for(let param of params)
        {
            let key = param[0],
                value = param[1],
                result = this.handleQueryParam(key, value);
            if(typeof result === "object") {
                data.push(result);
            }
        }

        let eventName = url.pathname.split("/").find((val) => {
            return val.includes("-tracks");
        });
        let eventType = "";

        if (eventName === "component-displayed-tracks") {
            eventType = "Display";
        } else if (eventName === "html-element-clicked-tracks") {
            eventType = "Click";
        }

        let customData = this.handleCustom(url, params, postParams);
        if(typeof customData === "object" && customData !== null)
        {
            if(customData.length) {
                data = data.concat(customData);
            } else {
                data.push(customData);
            }
        }

        return {
            "provider": {
                "name":    this.name + " " + eventType,
                "key":     this.key,
                "type":    this.type,
                "columns": this.columnMapping,
                "groups":  this.groups
            },
            "data": data
        };
    }

    /**
     * Parse custom properties for a given URL
     *
     * @param    {object}   url
     * @param    {object}   params
     * @param    {object}   postData
     *
     * @returns {Array}
     */
    handleCustom(url, params, postData)
    {
        let results = [],
            path = url.pathname.split("/");

        let eventName = path.find((val) => {
            return val.includes("-tracks");
        });

        if(eventName) {
            let eventValue = "";

            if (eventName === "component-displayed-tracks") {
                let componentId = postData.find(p => p[0] === "componentId");
                if(componentId) {
                    eventValue = componentId[1];
                }
            } else if (eventName === "html-element-clicked-tracks") {
                let htmlElementId = postData.find(p => p[0] === "htmlElementId");
                if(htmlElementId) {
                    eventValue = htmlElementId[1];
                }
            }

            results.push({
                "key":   "eventValue",
                "field": "Event Value",
                "value": eventValue,
                "group": "general"
            });
        }
        return results;
    }
}
