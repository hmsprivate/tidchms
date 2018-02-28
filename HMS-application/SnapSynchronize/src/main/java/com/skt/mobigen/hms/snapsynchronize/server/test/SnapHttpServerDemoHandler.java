package com.skt.mobigen.hms.snapsynchronize.server.test;

import static io.netty.handler.codec.http.HttpResponseStatus.CONTINUE;
import static io.netty.handler.codec.http.HttpVersion.HTTP_1_1;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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

import static io.netty.handler.codec.http.HttpHeaders.Names.CONNECTION;
import static io.netty.handler.codec.http.HttpHeaders.Names.CONTENT_LENGTH;
import static io.netty.handler.codec.http.HttpResponseStatus.*;

public class SnapHttpServerDemoHandler extends SimpleChannelInboundHandler<Object> {
	private Logger logger = LoggerFactory.getLogger(SnapHttpServerDemoHandler.class);
	private HttpRequest request;

	@Override
	public void channelReadComplete(ChannelHandlerContext ctx) {
		logger.debug("channel read complete");
		ctx.flush();
	}

	@Override
	protected void channelRead0(ChannelHandlerContext ctx, Object msg) {
		if (msg instanceof HttpRequest) {
			HttpRequest request = this.request = (HttpRequest) msg;
			if (HttpHeaders.is100ContinueExpected(request))
				send100Continue(ctx);
		}

		if (msg instanceof HttpContent) {
			HttpContent httpContent = (HttpContent) msg;
			ByteBuf connent = httpContent.content();
			String reequest_json_data = connent.toString(CharsetUtil.UTF_8);

			logger.debug("====================================");
			logger.debug("{}", reequest_json_data);
			new JobFactoryTest().factory(reequest_json_data);
			logger.debug("====================================");

			Object result = "end";
			
			if (msg instanceof LastHttpContent) {
				LastHttpContent trailer = (LastHttpContent) msg;
				if (!writeResponse(trailer, ctx, result)) {
					ctx.writeAndFlush(Unpooled.EMPTY_BUFFER).addListener(ChannelFutureListener.CLOSE);
				}
			}
		}
		
		
	}

	private void send100Continue(ChannelHandlerContext ctx) {
		FullHttpResponse response = new DefaultFullHttpResponse(HTTP_1_1, CONTINUE);
		ctx.write(response);
	}

	private boolean writeResponse(HttpObject trailer, ChannelHandlerContext ctx, Object result_msg) {
		boolean keepAlive = HttpHeaders.isKeepAlive(request);
		FullHttpResponse response = new DefaultFullHttpResponse(HTTP_1_1,
				trailer.getDecoderResult().isSuccess() ? OK : BAD_REQUEST,
				Unpooled.copiedBuffer(result_msg.toString(), CharsetUtil.UTF_8));
		if (keepAlive) {
			response.headers().set(CONTENT_LENGTH, response.content().readableBytes());
			response.headers().set(CONNECTION, HttpHeaders.Values.KEEP_ALIVE);
		}
		
		
		ctx.write(response);

		return keepAlive;
	}

}
