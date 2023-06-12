package pt.uc.dei.cliP5;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;
import java.util.Scanner;

import javax.ws.rs.client.Entity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyClientBuilder;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import pt.uc.dei.paj.DTO.NewsDTO;
import pt.uc.dei.paj.DTO.UserDTO;

public class MyApplicationCli {

	public static void main(String[] args) {
		Scanner scan = new Scanner(System.in);

		while (true) {
			System.out.println("What do you want to do?");
			String methodCalling = scan.nextLine();
			String[] arrayForMethodCalling = methodCalling.split(" ");
			if (arrayForMethodCalling.length < 2) {
				System.out.println("Invalid Argument!");
			} else if (arrayForMethodCalling[0].equalsIgnoreCase("add_users")
					|| arrayForMethodCalling[0].equalsIgnoreCase("add_user") && !arrayForMethodCalling[1].equals("")) {

				int nUser = Integer.parseInt(arrayForMethodCalling[1]);
				System.out.println("Number of users: " + nUser);

				addUser(nUser);

				System.out.println();

			} else if (arrayForMethodCalling[0].equalsIgnoreCase("add_news") && !arrayForMethodCalling[1].equals("")
					&& !arrayForMethodCalling[2].equals("")) {

				int nNews = Integer.parseInt(arrayForMethodCalling[2]);
				System.out.println("Number of news: " + nNews);

				String token = arrayForMethodCalling[1];
				addNews(nNews, token);

				System.out.println();

			} else {
				System.out.println("Invalid Argument!");

			}
			System.out.println();

		}
	}

	public static void addNews(int nNews, String token) {

//https://github.com/jiachengzhang1/newsapi-java
		// https://squatsstreak.medium.com/guide-to-use-news-api-in-5-minutes-for-free-23d66302dc41

		String key = "2f2c1377c3762d29cffe388f8df3a8373de834a0f3a6b3dacbe70d34c5af7e38";
		String catenewsheadlinesurl = "https://serpapi.com/" + "search.json?q=bitcoin&tbm=nws&location=Dallas&"
				+ "api_key=" + key;

		// get the client
		ResteasyClient clientNews = new ResteasyClientBuilder().build();

		// target a rest service
		ResteasyWebTarget targetNews = clientNews.target(catenewsheadlinesurl);

		// perform the GET request under that target
		Response responseNews = targetNews.request(MediaType.APPLICATION_JSON).get();
		if (responseNews.getStatus() != 200) {
			throw new RuntimeException("Failed : HTTP error code : " + responseNews.getStatus());
		}

		clientNews.register(new HeaderArguments("token", token));

		String jsonString = responseNews.readEntity(String.class);
		// System.out.println(jsonString);
		Gson gsonAux = new Gson();
		JsonArray jsonArray = new JsonArray();

		JsonObject jsonObject = gsonAux.fromJson(jsonString, JsonObject.class);

		jsonArray = jsonObject.getAsJsonArray("news_results");
		List<NewsDTO> listNews = new ArrayList(10);

	//	int max = 10;
		//int min = 0;
		for (int j = 0; j < nNews; j++) {
			//int random_int = (int) Math.floor(Math.random() * (max - min + 1) + min);
			NewsDTO newsDTO = new NewsDTO();
			JsonObject jsonObjectNews = (JsonObject) jsonArray.get(j);
			newsDTO.setTitle(jsonObjectNews.get("title").getAsString());
			newsDTO.setDescription(jsonObjectNews.get("snippet").getAsString());
			newsDTO.setCoverImage("https://picsum.photos/200");
			newsDTO.setKeywordsNews(givenList_shouldReturnARandomElement());
			listNews.add(newsDTO);
		
		}
		ResteasyWebTarget targetBackEnd = clientNews.target("http://localhost:8080/DataServer_Proj5/rest/news/newNews");
		
		for (NewsDTO newsDTO2 : listNews) {
			Response responseForBackEnd = targetBackEnd.request().post(Entity.json(newsDTO2));
			System.out.println(newsDTO2.getTitle());
		}
		

	}

	public static String givenList_shouldReturnARandomElement() {
		List<String> keywordsList = Arrays.asList("Altcoin", "Bitcoin", "Bitcoin Cash", "Block", "Blockchain", "Coin",
				"Coinbase", "Cold Wallet", "Cold Storage", "Cryptocurrency", "Decentralization",
				"Decentralized Finance", "Decentralized Applications", "Digital Gold", "Ethereum", "Exchange", "Fork",
				"Gas", "Genesis Block", "HODL", "Halving", "Hash", "Hot Wallet", "Initial Coin Offering",
				"Market Capitalization", "Mining", "Node", "Non-fungible Tokens", "Peer-to-peer", "Public Key",
				"Private Key", "Satoshi Nakomoto", "Smart Contract", "Stablecoin", "Digital Fiat", "Token",
				"Vitalik Buterin", "Wallet");

		Random rand = new Random();
		String keywords = "";
		for (int i = 0; i < 4; i++) {
			String randomElement = keywordsList.get(rand.nextInt(keywordsList.size()));
			keywords = randomElement + ";" + keywords;
		}

		return keywords;
	}

	public static void addUser(int nUser) {
		int i = 0;

		while (i < nUser) {

// get the client
			ResteasyClient clientUsers = new ResteasyClientBuilder().build();

// target a rest service
			ResteasyWebTarget targetUsers = clientUsers.target("https://randomuser.me/api/");

// perform the GET request under that target
			Response responseUsers = targetUsers.request(MediaType.APPLICATION_JSON).get();
			if (responseUsers.getStatus() != 200) {
				throw new RuntimeException("Failed : HTTP error code : " + responseUsers.getStatus());
			}
// read the response in string format!
			Gson gsonAux = new Gson();
			JsonArray jsonArray = new JsonArray();

			String jsonString = responseUsers.readEntity(String.class);
			JsonObject jsonObject = gsonAux.fromJson(jsonString, JsonObject.class);

			jsonArray = jsonObject.getAsJsonArray("results");
			JsonObject jsonObjectUser = (JsonObject) jsonArray.get(0);
			JsonObject nameObj = (JsonObject) jsonObjectUser.get("name");
			JsonObject loginObj = (JsonObject) jsonObjectUser.get("login");
			JsonObject imageObj = (JsonObject) jsonObjectUser.get("picture");

			UserDTO newRandomUser = new UserDTO();

			newRandomUser.setFirstName(nameObj.get("first").getAsString());
			newRandomUser.setLastName(nameObj.get("last").getAsString());
			newRandomUser.setUsername(loginObj.get("username").getAsString());
			newRandomUser.setPassword("123");
			// newRandomUser.setPassword(loginObj.get("password").getAsString());
			newRandomUser.setEmail(jsonObjectUser.get("email").getAsString());
			newRandomUser.setPictureUrl(imageObj.get("large").getAsString());
			newRandomUser.setEmail(jsonObjectUser.get("email").getAsString());

			// JsonObject newRandomUser = new JsonObject();
			/*
			 * newRandomUser.add("firstName", nameObj.get("first"));
			 * newRandomUser.add("lastName", nameObj.get("last"));
			 * newRandomUser.add("username", loginObj.get("username"));
			 * newRandomUser.add("password", loginObj.get("password"));
			 * newRandomUser.add("cellphone", jsonObjectUser.get("phone"));
			 * newRandomUser.add("email", jsonObjectUser.get("email"));
			 * newRandomUser.add("pictureUrl", imageObj.get("thumbnail"));
			 */

			/* String newUser = gsonAux.toJson(newRandomUser); */
			System.out.println("New User:" + newRandomUser);

			ResteasyWebTarget targetBackEnd = clientUsers
					.target("http://localhost:8080/DataServer_Proj5/rest/users/register");
			Response responseForBackEnd = targetBackEnd.request().post(Entity.json(newRandomUser));
			i++;
		}
	}

}

// para funcionar na linha de comandos

/*
 * if (args.length < 2 || args.length > 4) {
 * System.out.println("Invalid Argument!"); } else if
 * (args[0].equalsIgnoreCase("add_users") ||
 * args[0].equalsIgnoreCase("add_user") && !args[1].equals("")) {
 * 
 * int nUser = Integer.parseInt(args[1]);
 * 
 * addUser(nUser);
 * 
 * System.out.println();
 * 
 * } else if (args[0].equalsIgnoreCase("add_tasks") ||
 * args[0].equalsIgnoreCase("add_task") && !args[1].equals("") &&
 * !args[2].equals("") && !args[3].equals("")) { // int nUser =
 * Integer.parseInt(args[3]); addTask(args[1], args[2], nUser); } else {
 * System.out.println("Invalid Argument!");
 * 
 * } System.out.println();
 * 
 * }
 */

//Para funcionar na consola do Eclipse
/*
 * public class MyApplicationCli {
 * 
 * public static void main(String[] args) {
 * 
 * Scanner scan = new Scanner(System.in);
 * 
 * while (true) { System.out.println("What do you want to do?"); String
 * methodCalling = scan.nextLine(); String[] arrayForMethodCalling =
 * methodCalling.split(" "); if (arrayForMethodCalling.length < 2 ||
 * arrayForMethodCalling.length > 4) { System.out.println("Invalid Argument!");
 * } else if (arrayForMethodCalling[0].equalsIgnoreCase("add_users") ||
 * arrayForMethodCalling[0].equalsIgnoreCase("add_user") &&
 * !arrayForMethodCalling[1].equals("")) {
 * 
 * int nUser = Integer.parseInt(arrayForMethodCalling[1]);
 * System.out.print(nUser);
 * 
 * addUser(nUser);
 * 
 * System.out.println();
 * 
 * } else if (arrayForMethodCalling[0].equalsIgnoreCase("add_tasks") ||
 * arrayForMethodCalling[0].equalsIgnoreCase("add_task") &&
 * !arrayForMethodCalling[1].equals("") && !arrayForMethodCalling[2].equals("")
 * && !arrayForMethodCalling[3].equals("") ) { // int nUser =
 * Integer.parseInt(arrayForMethodCalling[3]); addTask(arrayForMethodCalling[1],
 * arrayForMethodCalling[2], nUser); } else {
 * System.out.println("Invalid Argument!");
 * 
 * } System.out.println();
 * 
 * } }
 */