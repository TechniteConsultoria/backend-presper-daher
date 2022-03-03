import nodemailer from 'nodemailer';
import { env } from 'process';
import { Md5 } from 'ts-md5';
import { v4 as uuidv4 } from 'uuid';
import { IServiceOptions } from './IServiceOptions';
import clienteRepository from '../database/repositories/clienteRepository';
import Error404 from '../errors/Error404';

export default class SmtpService {

    options: IServiceOptions;

    constructor(options) {
        this.options = options;
    }

    async convidar (email, link) {
        let transporter = await this.createTransporter()
        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: env.NODEMAILER_FROM, 
          to: email, 
          subject: env.NODEMAILER_INVITATION, 
          text: '', 
          html:
            'Olá, você foi convidado para o sistema Souleve como nutricionista. <p>Clique no link abaixo para acessar o sistema.</p><p><a href=' +
            link +
            '>Acessar sistema</a></p><p>Se você não reconhece esse convite, ignore este email.</p><p>Obrigado,</p><p>Souleve</p>', // html body
        })
    
        transporter.close()
    
        return info
      }

    async enviarVerificacaoBackOffice(to) {

        let cliente = await clienteRepository.appFindByEmail(to, this.options);

        if (cliente == null) {
            throw new Error404;
        }

        let baseUrl = env.NODEMAILER_BASE_URL || '';
        let verificarUrl = env.NODEMAILER_VERIFY_URL
        let id = cliente[0].id;
        let token = await this.gerarToken();

        let link = baseUrl + verificarUrl + '/' + id + '/' + token ;

        await clienteRepository.sendVerificationUpdateToken(cliente[0].id, token, this.options);

        // create reusable transporter object using the default SMTP transport
        let transporter = await this.createTransporter();

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: env.NODEMAILER_FROM, // sender address
            to: to, // list of receivers
            subject: env.NODEMAILER_VERIFY_SUBJECT, // Subject line
            text: "", // plain text body
            html: "Verifique sua conta para o app Souleve <p>Olá,</p><p>Clique no link abaixo para verificar o seu email.</p><p><a href=" + link + ">Verificar email</a></p><p>Sua senha de login é '123456' sem as aspas e deve ser mudada em 'Perfil' no aplicativo por motivos de segurança</p><p>Se você não solicitou essa verificação, ignore este email.</p><p>Obrigado,</p><p>Souleve</p>" // html body
        });

        transporter.close();

        return info;
    }

    // async..await is not allowed in global scope, must use a wrapper
    async enviarVerificacao(to) {

        let cliente = await clienteRepository.appFindByEmail(to, this.options);

        if (cliente == null) {
            throw new Error404;
        }

        let baseUrl = env.NODEMAILER_BASE_URL || '';
        let verificarUrl = env.NODEMAILER_VERIFY_URL
        let id = cliente[0].id;
        let token = await this.gerarToken();

        let link = baseUrl + verificarUrl + '/' + id + '/' + token ;

        await clienteRepository.sendVerificationUpdateToken(cliente[0].id, token, this.options);

        // create reusable transporter object using the default SMTP transport
        let transporter = await this.createTransporter();

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: env.NODEMAILER_FROM, // sender address
            to: to, // list of receivers
            subject: env.NODEMAILER_VERIFY_SUBJECT, // Subject line
            text: "", // plain text body
            html: "Verifique sua conta para o app Souleve <p>Olá,</p><p>Clique no link abaixo para verificar o seu email.</p><p><a href=" + link + ">Verificar email</a></p><p>Se você não solicitou essa verificação, ignore este email.</p><p>Obrigado,</p><p>Souleve</p>" // html body
        });

        transporter.close();

        return info;
    }

    async enviarResetarSenha(to) {

        let cliente = await clienteRepository.appFindByEmail(to, this.options);

        if (cliente == null) {
            throw new Error404;
        }

        let baseUrl = env.FRONTEND_URL || '';
        let resetarUrl = env.NODEMAILER_RESET_URL
        let id = cliente[0].id;
        let token = cliente[0].token;

        let hash = await clienteRepository.generateRecuperarSenhaToken(cliente[0].id, token, this.options);

        let link = `${baseUrl}/${resetarUrl}/${id}/${token}/${hash}`;

        // create reusable transporter object using the default SMTP transport
        let transporter = await this.createTransporter();

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: process.env.NODEMAILER_FROM, // sender address
            to: to, // list of receivers
            subject: env.NODEMAILER_RESET_SUBJECT, // Subject line
            text: "", // plain text body
            html: "Troque sua senha para o app Souleve <p>Olá,</p><p>Clique no link abaixo para trocar sua senha.</p><p><a href=" + link + ">Trocar Senha</a></p><p>Se você não solicitou a troca de senha, ignore este email.</p><p>Obrigado,</p><p>Souleve</p>" // html body, // html body
        });

        transporter.close();

        return info;
    }

    async createTransporter() {
        let transporter = nodemailer.createTransport({
            host: env.NODEMAILER_HOST,
            port: env.NODEMAILER_PORT,
            secure: env.NODEMAILER_SECURE, // true for 465, false for other ports
            auth: {
                user: env.NODEMAILER_AUTH_USER, // generated ethereal user
                pass: env.NODEMAILER_AUTH_PASSWORD, // generated ethereal password
            },
        });
        return transporter;
    }

    async gerarToken() {
        const token = Md5.hashStr(uuidv4());
        return token;
    }

}