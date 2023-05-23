import { Properties, JsonData, TagProps } from './interface';
import { isObj, isFunc, isStr, isArr } from '../utils';
import { SPACE, NEW_LINE, TAGS} from '../constants';

export default function toXmlString(props: Partial<Properties>, jsonData: JsonData): string {
  let xmlString: string = '';
  const aliasAttribute: string = props?.alias?.attribute || '_attr';
  const aliasContent: string = props?.alias?.content || '_val';
  const entityMapRegex = props.entityMap && RegExp(Object.keys(props.entityMap).join('|'), 'gi');

  const beautify = (char: string, repeat:number = 0): string => {
    if (!props.beautify) {
      return '';
    }
    let str: string = char;
    if (str === SPACE) {
      for (let i: number = 0; i < repeat; i += 1) {
        str += SPACE;
      }
      return repeat ? str : '';
    }
    return str;
  }

  const handleEntities = (str: string): string => {
    return entityMapRegex ? str.replace(entityMapRegex, (match: string) => props.entityMap?.[match] || '') : str;
  }

  const getStringVal = (inputData: any, doubleQuotes: boolean): string => {
    let strVal = isFunc(inputData) ? inputData() : inputData;
    if (isStr(strVal)) {
      strVal = handleEntities(strVal);
    }
    return doubleQuotes ? `"${strVal}"` : `${strVal}`;
  }

  const getAttributes = (attributes: JsonData): string => {
    let str = '';
    if (attributes) {
      Object.keys(attributes).forEach((a) => {
        str += ` ${a}=${getStringVal(attributes[a], true)}`;
      });
    }
    return str;
  }

  const isNestedData = (data: any): boolean => {
    return Boolean(isObj(data) && Object.keys(data).some((tagName) => ![aliasAttribute, aliasContent].includes(tagName)))
  }

  const hasValToShow = (data: any) : boolean => {
    // let result: boolean;

    // if (isObj(data)) {
    //   result = Object.keys(data).some((tagName) => ![aliasAttribute].includes(tagName));
    // } else if (isFunc(data)) {
    //   result = data();
    // } else {
    //   result = data;
    // }
    // return Boolean(result);

    if (isObj(data)) {
      return Object.keys(data).some((key) => ![aliasAttribute].includes(key));
    } 
    return Boolean(data);
  }

  const createXmlTag = (name: string, type: string, tagProps: Partial<TagProps>) => {
    if(type && name) {
      if (type === TAGS.OPENING) {
        xmlString += `${beautify(SPACE, tagProps.level)}<${name}${getAttributes(tagProps.attributes)}>`;
      } else if (type === TAGS.SELF_CLOSING) {
        xmlString += `${beautify(SPACE, tagProps.level)}<${name}${getAttributes(tagProps.attributes)}/>${beautify(NEW_LINE)}`;
      } 
      // closing tag
      else {
        xmlString += `${tagProps.childTags ? beautify(SPACE, tagProps.level) : ''}</${name}>${beautify(NEW_LINE)}`;
      }
      return;
    }
    // to show content between tags <Tag>content</Tag>
    xmlString += `${getStringVal(tagProps.content, false)}`;
  }
  
  const generateXmlString = (key: string, data: any, level: number) => {

    if(isArr(data)) {
      return data.forEach((d: any) => {
        generateXmlString(key, d, level);
      })
    }

    if ([aliasAttribute, aliasContent].includes(key)) {
      return;
    }

    const attributes = data[aliasAttribute];
    if (!hasValToShow(data) && props.selfClosing) {
      createXmlTag(key, TAGS.SELF_CLOSING, {attributes, level});
      return;
    }

    createXmlTag(key, TAGS.OPENING, {attributes, level});

    const childTags: boolean = isNestedData(data);
    if(childTags) {
      xmlString += beautify(NEW_LINE);
      Object.keys(data).forEach((k) => {
        generateXmlString(k, data[k], level + 1);
      });
    } else {
      const content: any = isObj(data) ? data[aliasContent] : data;
      createXmlTag('', '', { content });
    }
    createXmlTag(key, TAGS.CLOSING, { level, childTags });
  }

  const parseToXml = (data: JsonData): string => {
    Object.keys(data).forEach((key) => {
      generateXmlString(key, data[key], 0);
    });
    return xmlString;
  }
  
  return parseToXml(jsonData);
}