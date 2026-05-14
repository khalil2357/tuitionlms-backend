import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create.dto';
import { UpdateCourseDto } from './dto/update.dto';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new course' })
  @ApiResponse({ status: 201, description: 'Course created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  create(@Req() req: any, @Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(req.user.id, createCourseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all published courses' })
  @ApiResponse({ status: 200, description: 'Returns list of courses' })
  findAll(@Query('page') page: string = '1', @Query('limit') limit: string = '10') {
    return this.coursesService.findAll(parseInt(page), parseInt(limit));
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all categories with course counts' })
  findCategories() {
    return this.coursesService.listCategories();
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get course details by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.coursesService.findBySlug(slug);
  }

  @Get('instructor/my-courses')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all courses created by the logged-in instructor' })
  @ApiResponse({ status: 200, description: 'Returns instructor courses' })
  findByInstructor(
    @Req() req: any,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ) {
    return this.coursesService.findByInstructor(req.user.id, parseInt(page), parseInt(limit));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get course details by ID' })
  @ApiResponse({ status: 200, description: 'Returns course details' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  findById(@Param('id') id: string) {
    return this.coursesService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a course' })
  @ApiResponse({ status: 200, description: 'Course updated successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() updateCourseDto: UpdateCourseDto
  ) {
    return this.coursesService.update(id, req.user.id, updateCourseDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a course' })
  @ApiResponse({ status: 200, description: 'Course deleted successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  delete(@Param('id') id: string, @Req() req: any) {
    return this.coursesService.delete(id, req.user.id);
  }

  @Post(':id/publish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish a course' })
  @ApiResponse({ status: 200, description: 'Course published successfully' })
  publish(@Param('id') id: string, @Req() req: any) {
    return this.coursesService.publish(id, req.user.id);
  }

  @Post(':id/unpublish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unpublish a course' })
  @ApiResponse({ status: 200, description: 'Course unpublished successfully' })
  unpublish(@Param('id') id: string, @Req() req: any) {
    return this.coursesService.unpublish(id, req.user.id);
  }
}

