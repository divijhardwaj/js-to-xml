Transform JSON/JS to xml.
##### [Contribute](https://github.com/divijhardwaj/js-xml-parser) to make this project better.

##### Main Features
* Transform JSON to XML.
* Works with node packages, in browser, and in CLI.
* It can handle deeply nested JSON Objects.
* Options Available for customization
    * You can indent your xml data.
    * You can choose the attribute and value property(JSON) that contains attributs and value for a tag respectively.
* Does not require any content property in JSON for nesting tags. Any property in JSON which is not attribute is or value is treated as childen tag or tags.

## How to use
***
`$npm install js-xml-parser`

##### JSON/JS Object TO XML
```js
import { jsToXml } from 'js-xml-parser';

const options = {
    indent: true,
    attribute: '_attrs',
    value: '_value'
}

const jsonData = {
  'SOAP-ENV:Envelope': {
    '_attrs': {
      'xmlns:SOAP-ENV': 'http://www.w3.org/2001/12/soap-envelope',
      'SOAP-ENV:encodingStyle': 'http://www.w3.org/2001/12/soap-encoding'
    },
    'SOAP-ENV:Body': {
      '_attrs': {
        'xmlns:m': 'http://www.xyz.org/quotations'
      },
      'm:Person': {
        '_value': 'Divij',
        '_attrs': {
          gender: 'male',
          age: 25
        }
      },
      family: {
        mother: 'mother name',
        father: {
          '_value': 'father"s name',
          '_attrs': {
            age: 50,
            gender: 'male'
          }
        },
        siblings: ''
      },
      ENTITIES: {
        LessThan: 'this < that',
        GreaterThan: 'this > that',
        Amp: 'something & something',
        Quot: '"Nice"',
        Apos: "Divij's Birthday"
      }
    }
  }
};

const xml = jsToXml(test, { indent: true, attribute: '_attrs', value: '_value' });
console.log(xml);
```

**OUTPUT**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://www.w3.org/2001/12/soap-envelope" SOAP-ENV:encodingStyle="http://www.w3.org/2001/12/soap-encoding">
  <SOAP-ENV:Body xmlns:m="http://www.xyz.org/quotations">
   <m:Person gender="male" age="25">Divij</m:Person>
   <family>
    <mother>mother name</mother>
    <father age="50" gender="male">father&quot;s name</father>
    <siblings/>
   </family>
   <ENTITIES>
    <LessThan>this &lt; that</LessThan>
    <GreaterThan>this &gt; that</GreaterThan>
    <Amp>something &amp; something</Amp>
    <Quot>&quot;Nice&quot;</Quot>
    <Apos>Divij&apos;s Birthday</Apos>
   </ENTITIES>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>
```

**Options**
* **indent**. Boolean, for indentation of transformed XML data.
* **attribute**. String, for picking attributes of tags from the JSON using the property name passed here.
* **value**. String, for picking value of tags from the JSON using the property name passed here.

**Limitations**
* Nested tags are created using recursion, so it lacks Tail Call Optimization.
* Not tested with large JSON data.
* Currently this package does not support flat JSON as an input.