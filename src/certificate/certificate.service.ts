import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CertificateService {
	constructor(private prisma: PrismaService) {}

	private assertObjectId(id: string, resourceName: string) {
		if (!id) {
			throw new BadRequestException(`${resourceName} id is required`);
		}
	}

	async issue(studentId: string, payload: { courseName: string; certificateUrl: string }) {
		this.assertObjectId(studentId, 'student');

		const student = await this.prisma.user.findUnique({
			where: { id: studentId },
			select: { id: true },
		});

		if (!student) {
			throw new NotFoundException('User not found');
		}

		const certificate = await this.prisma.certificate.create({
			data: {
				studentId,
				courseName: payload.courseName,
				certificateUrl: payload.certificateUrl,
			},
			include: {
				student: {
					select: { id: true, name: true, email: true, avatar: true },
				},
			},
		});

		return certificate;
	}

	async findAll(studentId?: string) {
		if (studentId) {
			this.assertObjectId(studentId, 'student');
		}

		return this.prisma.certificate.findMany({
			where: studentId ? { studentId } : undefined,
			include: {
				student: {
					select: { id: true, name: true, email: true, avatar: true },
				},
			},
			orderBy: { issuedAt: 'desc' },
		});
	}

	async myCertificates(studentId: string) {
		return this.findAll(studentId);
	}

	async findOne(id: string) {
		this.assertObjectId(id, 'certificate');

		const certificate = await this.prisma.certificate.findUnique({
			where: { id },
			include: {
				student: {
					select: { id: true, name: true, email: true, avatar: true },
				},
			},
		});

		if (!certificate) {
			throw new NotFoundException('Certificate not found');
		}

		return certificate;
	}

	async remove(id: string) {
		this.assertObjectId(id, 'certificate');

		const certificate = await this.prisma.certificate.findUnique({
			where: { id },
		});

		if (!certificate) {
			throw new NotFoundException('Certificate not found');
		}

		return this.prisma.certificate.delete({
			where: { id },
		});
	}
}
