import { CreateDocumentDto } from '@dtos/create-document.dto';
import { DocAuthDto } from '@dtos/doc-auth.dto';
import { ShareDocumentDto } from '@dtos/share-document.dto';
import { UpdateDocumentDto } from '@dtos/update-document.dto';
import { CheckDocumentAuthority, DocumentAuthorityGuard } from '@guard/document-auth.guard';
import { CheckDocumentStatus, DocumentStatusGuard } from '@guard/document-status.guard';
import { JwtGuard } from '@guard/jwt.guard';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DocumentService } from '@services/document.service';
import { DocumentApiDefinition, DocumentStatus } from '@think/domains';

@Controller('document')
@UseGuards(DocumentAuthorityGuard)
@UseGuards(DocumentStatusGuard)
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  /**
   * 搜索文档
   * @param req
   * @param keyword
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(DocumentApiDefinition.search.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async search(@Request() req, @Query('keyword') keyword) {
    return await this.documentService.search(req.user, keyword);
  }

  /**
   * 获取用户最近访问的文档
   * @param req
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(DocumentApiDefinition.recent.server)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  async getWorkspaceDocuments(@Request() req) {
    return await this.documentService.getRecentDocuments(req.user);
  }

  /**
   * 新建文档
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post(DocumentApiDefinition.create.server)
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGuard)
  async createDocument(@Request() req, @Body() dto: CreateDocumentDto) {
    return await this.documentService.createDocument(req.user, dto);
  }

  /**
   * 获取文档详情
   * @param req
   * @param documentId
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(DocumentApiDefinition.getDetailById.server)
  @HttpCode(HttpStatus.OK)
  @CheckDocumentAuthority('readable')
  @UseGuards(JwtGuard)
  async getDocumentDetail(@Request() req, @Param('id') documentId) {
    return await this.documentService.getDocumentDetail(req.user, documentId, req.headers['user-agent']);
  }

  /**
   * 更新文档
   * @param req
   * @param documentId
   * @param dto
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(DocumentApiDefinition.updateById.server)
  @HttpCode(HttpStatus.OK)
  @CheckDocumentAuthority('editable')
  @UseGuards(JwtGuard)
  async updateDocument(@Request() req, @Param('id') documentId, @Body() dto: UpdateDocumentDto) {
    return await this.documentService.updateDocument(req.user, documentId, dto);
  }

  /**
   * 获取文档版本记录
   * @param req
   * @param documentId
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(DocumentApiDefinition.getVersionById.server)
  @HttpCode(HttpStatus.OK)
  @CheckDocumentAuthority('readable')
  @UseGuards(JwtGuard)
  async getDocumentVersion(@Request() req, @Param('id') documentId) {
    return await this.documentService.getDocumentVersion(req.user, documentId);
  }

  /**
   * 获取文档成员
   * @param req
   * @param documentId
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(DocumentApiDefinition.getMemberById.server)
  @HttpCode(HttpStatus.OK)
  @CheckDocumentAuthority('readable')
  @UseGuards(JwtGuard)
  async getDocUsers(@Request() req, @Param('id') documentId) {
    return await this.documentService.getDocUsers(req.user, documentId);
  }

  /**
   * 添加文档成员
   * 只有文档创建着才可操作
   * @param req
   * @param dto
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post(DocumentApiDefinition.addMemberById.server)
  @HttpCode(HttpStatus.OK)
  @CheckDocumentAuthority('createUser')
  @UseGuards(JwtGuard)
  async addDocUser(@Request() req, @Body() dto: DocAuthDto) {
    return await this.documentService.addDocUser(req.user, dto);
  }

  /**
   * 修改文档成员（一般是权限操作）
   * 只有文档创建着才可操作
   * @param req
   * @param dto
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(DocumentApiDefinition.updateMemberById.server)
  @HttpCode(HttpStatus.OK)
  @CheckDocumentAuthority('createUser')
  @UseGuards(JwtGuard)
  async updateDocUser(@Request() req, @Body() dto: DocAuthDto) {
    return await this.documentService.updateDocUser(req.user, dto);
  }

  /**
   * 删除文档成员
   * 只有文档创建着才可操作
   * @param req
   * @param dto
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post(DocumentApiDefinition.deleteMemberById.server)
  @HttpCode(HttpStatus.OK)
  @CheckDocumentAuthority('createUser')
  @UseGuards(JwtGuard)
  async deleteDocUser(@Request() req, @Body() dto: DocAuthDto) {
    return await this.documentService.deleteDocUser(req.user, dto);
  }

  /**
   * 获取文档下的子文档
   * @param req
   * @param data
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post(DocumentApiDefinition.getChildren.server)
  @HttpCode(HttpStatus.OK)
  @CheckDocumentAuthority('readable')
  @UseGuards(JwtGuard)
  async getChildrenDocuments(@Request() req, @Body() data) {
    return await this.documentService.getChildrenDocuments(req.user, data);
  }

  /**
   * 删除文档
   * @param req
   * @param documentId
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(DocumentApiDefinition.deleteById.server)
  @HttpCode(HttpStatus.OK)
  @CheckDocumentAuthority('createUser')
  @UseGuards(JwtGuard)
  async deleteDocument(@Request() req, @Param('id') documentId) {
    return await this.documentService.deleteDocument(req.user, documentId);
  }

  /**
   * 分享（或关闭分享）文档
   * @param req
   * @param documentId
   * @param dto
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post(DocumentApiDefinition.shareById.server)
  @HttpCode(HttpStatus.OK)
  @CheckDocumentAuthority('editable')
  @UseGuards(JwtGuard)
  async shareDocument(@Request() req, @Param('id') documentId, @Body() dto: ShareDocumentDto) {
    return await this.documentService.shareDocument(req.user, documentId, dto);
  }

  /**
   * 获取公开文档详情
   * @param req
   * @param documentId
   * @param dto
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post(DocumentApiDefinition.getPublicDetailById.server)
  @CheckDocumentStatus(DocumentStatus.public)
  @HttpCode(HttpStatus.OK)
  async getShareDocumentDetail(@Request() req, @Param('id') documentId, @Body() dto: ShareDocumentDto) {
    return await this.documentService.getPublicDocumentDetail(documentId, dto, req.headers['user-agent']);
  }

  /**
   * 获取公开文档的子文档
   * @param data
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post(DocumentApiDefinition.getPublicChildren.server)
  @CheckDocumentStatus(DocumentStatus.public)
  @HttpCode(HttpStatus.OK)
  async getShareChildrenDocuments(@Body() data) {
    return await this.documentService.getShareChildrenDocuments(data);
  }
}
