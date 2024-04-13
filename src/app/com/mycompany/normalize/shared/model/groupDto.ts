/**
 * TimeVision API
 * API for TimeVision
 *
 * OpenAPI spec version: v1.0.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { CalendarDto } from './calendarDto';
import { GroupType } from './groupType';
import { MinimalGroupDto } from './minimalGroupDto';
import { UserDto } from './userDto';

export interface GroupDto { 
    id?: string;
    name?: string;
    type?: GroupType;
    calendar?: CalendarDto;
    users?: Array<UserDto>;
    sons?: Array<MinimalGroupDto>;
    fathers?: Array<MinimalGroupDto>;
    approvers?: Array<MinimalGroupDto>;
}