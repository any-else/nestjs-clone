"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionalParseIntArrayPipe = void 0;
const common_1 = require("@nestjs/common");
let OptionalParseIntArrayPipe = class OptionalParseIntArrayPipe {
    transform(value, metadata) {
        console.log(value);
        if (value === undefined || value === null) {
            return undefined;
        }
        if (Array.isArray(value)) {
            const parsedValues = value.map((v) => {
                const parsedValue = parseInt(v, 10);
                return isNaN(parsedValue) ? undefined : parsedValue;
            });
            return parsedValues;
        }
        else {
            const parsedValue = parseInt(value, 10);
            return isNaN(parsedValue) ? undefined : [parsedValue];
        }
    }
};
OptionalParseIntArrayPipe = __decorate([
    (0, common_1.Injectable)()
], OptionalParseIntArrayPipe);
exports.OptionalParseIntArrayPipe = OptionalParseIntArrayPipe;
//# sourceMappingURL=parse.transform.js.map