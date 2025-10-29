import { Body, Controller, Get, Post, Param, UseGuards } from "@nestjs/common";
import { ActivityService } from "./activity.service";
import { ProgressService } from "./progress.service";
import { RequestActivityAccountDTO } from "./request-activity.dto";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt.auth.guard";
import { RolesGuard } from "src/auth/roles.guard";
import { Roles } from "src/auth/roles.decorator";
import { AccountRoles } from "src/auth/role.enum";


@ApiTags('hack-pass')
@Controller('hack-pass')
export class HackPassController { 
    constructor (
        private activityService: ActivityService, 
        private progressService: ProgressService,
    ) {}

    @ApiOperation({ summary: 'Get user points'})
    @ApiParam({ 
        description: 'Account ID of user',
        name: 'account_id'
    })
    @UseGuards(JwtAuthGuard)
    @Get('progress/:account_id')    
    async getProgress(@Param('account_id') accountId: string) {
        return await this.progressService.getProgressByAccountId(accountId);
    }

    @ApiOperation({ summary: 'Get all activities from a user'})
    @ApiParam({
        description: 'Account ID of the user',
        name: 'account_id'
    })
    @UseGuards(JwtAuthGuard)
    @Get('activities/:account_id')
    async getActivity(@Param('account_id') account_id: string) { 
        return await this.activityService.getActivitiesByAccountId(account_id);
    }

    @ApiOperation({ summary: 'Record new activity and reward points'})
    @ApiBody({ 
        description: 'Activity details including rewards and origin',
        type: RequestActivityAccountDTO
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER]) i'm assuming users will be able to scan activities, but I'll leave this to check
    @Post('activity')
    async rewardActivity(@Body() activity: RequestActivityAccountDTO) { 
        return await this.activityService.rewardActivity(
            activity.account_id,
            activity
        );
    }
}