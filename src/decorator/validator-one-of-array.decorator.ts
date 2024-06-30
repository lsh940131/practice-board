import { Type } from "@nestjs/common";
import { ValidationOptions, registerDecorator } from "class-validator";

/**
 * 제시된 배열로 유효성 검사
 * @param {Array<any>} conditions
 * @param {ValidationOptions} [validationOptions]
 * @returns {(object: any, propertyName: string) => void}
 */
export const ValidatorOneOfArray = (conditions: Array<any>, validationOptions?: ValidationOptions): ((object: any, propertyName: string) => void) => {
	return (object: Record<string, any>, propertyName: string) => {
		registerDecorator({
			name: "ValidatorOneOfArray",
			target: object.constructor,
			propertyName: propertyName,
			constraints: [],
			options: {
				message: `Invalid input value. You must input the '${propertyName}' one of [${conditions.join()}]`,
				...validationOptions,
			},
			validator: {
				validate(value: Type) {
					const result = conditions.find((x) => x === value);
					return result ? true : false;
				},
			},
		});
	};
};
