package com.skt.mobigen.hms.snapsynchronize.server;

import static io.netty.handler.codec.http.HttpHeaders.Names.CONNECTION;
import static io.netty.handler.codec.http.HttpHeaders.Names.CONTENT_LENGTH;
import static io.netty.handler.codec.http.HttpResponseStatus.BAD_REQUEST;
import static io.netty.handler.codec.http.HttpResponseStatus.CONTINUE;
import static io.netty.handler.codec.http.HttpResponseStatus.OK;
import static io.netty.handler.codec.http.HttpVersion.HTTP_1_1;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.skt.mobigen.hms.snapsynchronize.jobfactory.SnapSynchronizeJobFactory;
import com.skt.mobigen.hms.snapsynchronize.server.test.JobFactoryTest;
import com.skt.mobigen.hms.snapsynchronize.service.SnapSynchronizeService;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.DefaultFullHttpResponse;
import io.netty.handler.codec.http.FullHttpResponse;
import io.netty.handler.codec.http.HttpContent;
import io.netty.handler.codec.http.HttpHeaders;
import io.netty.handler.codec.http.HttpObject;
import io.netty.handler.codec.http.HttpRequest;
import io.netty.handler.codec.http.LastHttpContent;
import io.netty.util.CharsetUtil;

public class SnapSynchronizeHttpServerHandler extends SimpleChannelInboundHandler<Object> {
	private Logger logger = LoggerFactory.getLogger(SnapSynchronizeHttpServerHandler.class);
	private SnapSynchronizeService synchronizeService;

	public SnapSynchronizeHttpServerHandler(SnapSynchronizeService synchronizeService) {
		this.synchronizeService = synchronizeService;
	}

	private HttpRequest request;

	@Override
	protected void channelRead0(ChannelHandlerContext ctx, Object msg) throws Exception {
		if (msg instanceof HttpRequest) {
			HttpRequest request = this.request = (HttpRequest) msg;
			if (HttpHeaders.is100ContinueExpected(request))
				send100Continue(ctx);
		}
		
		if (msg instanceof HttpContent) {
			HttpContent httpContent = (HttpContent) msg;
			ByteBuf connent = httpContent.content();
			String reequest_json_data = connent.toString(CharsetUtil.UTF_8);

			logger.debug("receive data :{}", reequest_json_data);

			Object result_msg = synchronizeService.service(reequest_json_data);
			
			logger.debug("result msg : {}", result_msg);
			
			if (msg instanceof LastHttpContent) {
				LastHttpContent trailer = (LastHttpContent) msg;
				if (!writeResponse(trailer, ctx, result_msg)) {
					ctx.writeAndFlush(Unpooled.EMPTY_BUFFER).addListener(ChannelFutureListener.CLOSE);
				}
			}
		}
		
	}
	
	private boolean writeResponse(HttpObject trailer, ChannelHandlerContext ctx, Object result_msg) {
		boolean keepAlive = HttpHeaders.isKeepAlive(request);
		FullHttpResponse response;
		if (result_msg == null || result_msg.equals("Invalid Json")) {
			response = new DefaultFullHttpResponse(HTTP_1_1, BAD_REQUEST);
			if (keepAlive) {
				response.headers().set(CONNECTION, HttpHeaders.Values.CLOSE);
			}
		} else {
			response = new DefaultFullHttpResponse(HTTP_1_1, trailer.getDecoderResult().isSuccess() ? OK : BAD_REQUEST,
					Unpooled.copiedBuffer(result_msg.toString(), CharsetUtil.UTF_8));
			if (keepAlive) {
				response.headers().set(CONTENT_LENGTH, response.content().readableBytes());
				response.headers().set(CONNECTION, HttpHeaders.Values.CLOSE);
			}
		}
		
		ctx.write(response);
		return keepAlive;
	}

	private void send100Continue(ChannelHandlerContext ctx) {
		FullHttpResponse response = new DefaultFullHttpResponse(HTTP_1_1, CONTINUE);
		ctx.write(response);
	}

	@Override
	public void channelReadComplete(ChannelHandlerContext ctx) {
		ctx.flush();
	}
	
	@Override
	public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
		logger.error("exceptionCaught : {}", cause.getMessage());
		cause.printStackTrace();
		ctx.close();
	}

}
