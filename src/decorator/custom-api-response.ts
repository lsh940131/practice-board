/**
 * Swagger API Document decorator
 */

import { HttpStatus, Type, applyDecorators } from '@nestjs/common';
import { ApiPropertyOptions } from '@nestjs/swagger';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ResponseDto, ErrorDto } from '../dto/common.dto';

const DECORATORS_PREFIX = 'swagger';
const API_MODEL_PROPERTIES = `${DECORATORS_PREFIX}/apiModelProperties`;
const API_MODEL_PROPERTIES_ARRAY = `${DECORATORS_PREFIX}/apiModelPropertiesArray`;

interface option {
	title: string;
	description?: string;

	/**
	 * dto
	 */
	model: Type<any>;

	statusCode?: number;

	data?: any;

	error?: ErrorDto;

	/**
	 * generic type of data
	 */
	generic?: Type<any>;
}

export const CustomApiResponse = (statusCode: HttpStatus, description: string, options: option[]) => {
	// swagger api의 example은 실제 값이 있는 instance여야 예시를 보여줄 수 있음
	const examples = options
		.map((o: option) => {
			const responseInstance = makeInstanceByApiProperty<ResponseDto>(ResponseDto);

			const dtoModel = o.model;
			const dtoObj = makeInstanceByApiProperty<typeof dtoModel>(dtoModel, o.generic);

			responseInstance.data = o.data !== undefined ? o.data : dtoObj;
			responseInstance.error = o.error !== undefined ? o.error : null;

			return {
				[o.title]: {
					value: responseInstance,
					description: o.description,
				},
			};
		})
		.reduce((acc, cur) => {
			Object.assign(acc, cur);
			return acc;
		}, {});

	// swagger api response에 model 등록을 위함
	const extraModel = options.map((o) => o.model) as unknown as Type[];

	// 중복값 제거
	const setOfExtraModel = new Set(extraModel);

	// $ref 추가
	const pathOfDto = [...setOfExtraModel].map((e) => ({ $ref: getSchemaPath(e) }));

	// generic
	const extraGeneric = options.map((o) => o.generic).filter((i) => i) as unknown as Type[];
	const pathOfGeneric = extraGeneric.map((e) => ({ $ref: getSchemaPath(e) }));

	const oneOf = [...pathOfDto, ...pathOfGeneric];
	const schemaKey = oneOf?.length > 1 ? 'oneOf' : '$ref';
	const schemaValue = schemaKey == 'oneOf' ? oneOf : getSchemaPath(options[0].model);

	return applyDecorators(
		ApiExtraModels(...extraModel, ...extraGeneric),
		ApiResponse({
			status: statusCode,
			content: {
				'application/json': {
					schema: {
						[schemaKey]: schemaValue,
					},
					examples: examples,
				},
			},
			description,
		}),
	);
};

type ApiPropertyOptionsWithFieldName = ApiPropertyOptions & {
	fieldName: string;
};

function makeInstanceByApiProperty<T>(dtoClass: Type, generic?: Type): T {
	// 생성자 파라미터가 필수인 경우 대응하기 어렵기 때문에 dtoClass의 생성자로 만들지 않고 apiProperty로 지정한 필드들을 가져다 넣는 방식으로 진행
	const obj = {};

	const propertiesArr: string[] = Reflect.getMetadata(API_MODEL_PROPERTIES_ARRAY, dtoClass.prototype) || [];
	const properties: ApiPropertyOptionsWithFieldName[] = propertiesArr.map((field) => {
		const fieldName = field.substring(1);
		const o = Reflect.getMetadata(API_MODEL_PROPERTIES, dtoClass.prototype, fieldName);
		o.fieldName = fieldName;
		return o;
	});

	for (const property of properties) {
		const propertyType = whatIsPropertyType(property);

		switch (propertyType) {
			case 'generic':
				if (generic) {
					if (property.isArray) {
						obj[property.fieldName] = [makeInstanceByApiProperty(generic)];
					} else {
						obj[property.fieldName] = makeInstanceByApiProperty(generic);
					}
				}
				break;

			case 'string':
			case 'number':
			case 'primary':
				obj[property.fieldName] = property.default || property.example || property.description;
				break;

			case 'lazy':
				const constructorType = (property.type as Function)();

				if (Array.isArray(constructorType)) {
					obj[property.fieldName] = [makeInstanceByApiProperty(constructorType[0])];
				} else if (property.isArray) {
					obj[property.fieldName] = [makeInstanceByApiProperty(constructorType)];
				} else {
					obj[property.fieldName] = makeInstanceByApiProperty(constructorType);
				}
				break;

			case 'type':
				if (property.isArray) {
					obj[property.fieldName] = [makeInstanceByApiProperty(property.type as Type)];
				} else {
					obj[property.fieldName] = makeInstanceByApiProperty(property.type as Type);
				}
				break;
		}
	}

	return obj as T;
}

function whatIsPropertyType(property: ApiPropertyOptionsWithFieldName): string {
	let typeString: string;
	const propertyType = property.type;

	if ((typeString = ['generic', 'string', 'number'].find((i) => i === propertyType))) {
	} else if (isPrimaryType(propertyType)) {
		typeString = 'primary';
	} else if (isLazyTypeFunc(propertyType as Function | Type<unknown>)) {
		typeString = 'lazy';
	} else if (checkType(propertyType)) {
		typeString = 'type';
	}

	return typeString;
}

function isObject(o: any) {
	const type = typeof o;
	return o != null && (type == 'object' || type == 'function');
}

function isFunction(f: any): f is Function {
	if (!isObject(f)) {
		return false;
	}
	return true;
}

function isPrimaryType(type: string | Function | Type<unknown> | [Function] | Record<string, any> | undefined): boolean {
	return typeof type === 'function' && [String, Boolean, Number].some((item) => item === type);
}

function isLazyTypeFunc(t: Function | Type<unknown>): t is { type: Function } & Function {
	return isFunction(t) && t.name == 'type';
}

function checkType(a: any): a is Type {
	return typeof a === 'string';
}
