import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CertificateService } from './certificate.service';

@ApiTags('Certificates')
@Controller('certificate')
export class CertificateController {}
	constructor(private readonly certificateService: CertificateService) {}

	@Post()
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Issue a certificate' })
	@ApiResponse({ status: 201, description: 'Certificate issued successfully' })
	issue(
		@Req() req: any,
		@Body() body: { courseName: string; certificateUrl: string },
	) {
		return this.certificateService.issue(req.user.id, body);
	}

	@Get()
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Get certificates' })
	@ApiResponse({ status: 200, description: 'Returns certificates' })
	findAll(@Query('studentId') studentId?: string) {
		return this.certificateService.findAll(studentId);
	}

	@Get('my-certificates')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Get current user certificates' })
	@ApiResponse({ status: 200, description: 'Returns current user certificates' })
	myCertificates(@Req() req: any) {
		return this.certificateService.myCertificates(req.user.id);
	}

	@Get(':id')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Get certificate details by ID' })
	@ApiResponse({ status: 200, description: 'Returns certificate details' })
	@ApiResponse({ status: 404, description: 'Certificate not found' })
	findOne(@Param('id') id: string) {
		return this.certificateService.findOne(id);
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Delete a certificate' })
	@ApiResponse({ status: 200, description: 'Certificate deleted successfully' })
	remove(@Param('id') id: string) {
		return this.certificateService.remove(id);
	}
