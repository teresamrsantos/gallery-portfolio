package pt.uc.dei.cliP5;

import java.io.IOException;

import javax.ws.rs.client.ClientRequestContext;
import javax.ws.rs.client.ClientRequestFilter;


//fonte pesquisa: https://wondergoatsbeard.wordpress.com/2015/10/29/add-custom-header-to-resteasy-client-request/
public class HeaderArguments implements ClientRequestFilter {

	private final String token;
	private final String value;
	
	public HeaderArguments(String token, String value) {
		this.token = token;
		this.value = value;

	}

	@Override
	public void filter(ClientRequestContext requestContext) throws IOException {
		// TODO Auto-generated method stub
		requestContext.getHeaders().add(token,value);
	}
	//fonte pesquisa: https://wondergoatsbeard.wordpress.com/2015/10/29/add-custom-header-to-resteasy-client-request/
	


	//@Override
	/*public void filter(ClientRequestContext requestContext) throws IOException {
		requestContext.getHeaders().add(token);
	}*/

}

