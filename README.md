# Tech Blog Notifier

This project is a serverless bot designed to poll RSS feeds from popular engineering blogs and update a profile on the BlueSky social network. The bot operates on Cloudflare Workers, performing polling every 4 hours and utilizing qStash queues to manage processing time per request.

## Architecture

The architecture of the bot follows this model:

1. **Scheduler**: Initiates every 4 hours, fetching a list of RSS feed URLs and placing them into a QStash queue.
2. **Feed Parser**: Each URL in the queue triggers the route `POST /blog` that parses the RSS feed, extracting items added in the last 4 hours.
3. **Post Formatter**: Converts each new feed item into a text post and places it into another qStash queue.
4. **BlueSky Poster**: Each text post in the queue triggers the route `POST /bsky` that sends the post to the BlueSky profile.

![Schema](/assets/model.png)

## Setup

1. **Clone the repository**:

    ```sh
    git clone https://github.com/vitorxfs/techblognotifier.git
    cd techblognotifier
    ```

2. **Install dependencies**:

    ```sh
    pnpm install
    ```

3. **Configure Upstash**:

    - Create an account at Upstash and save the QStash token;

4. **Deploy to Cloudflare Workers**:

    - Deploy to Cloudflare:

    ```sh
    wrangler deploy
    ```

    - Add the following environment variables in your cloudflare dashboard:

    ```env
    BLUESKY_BOT_USERNAME=<bluesky_username>
    BLUESKY_BOT_PASSWORD=<bluesky_password>
    API_PASSWORD=<a_password_to_close_routes>
    QSTASH_TOKEN=<your_qstash_token>
    ```

## Running Locally

1. If you want to test locally, follow the previous steps, except for step 4.

2. **Configure environment variables**:
    - Create a `.dev.vars` file in the root directory. It works the same way as a `.env` file.
    - Add the following variables:

    ```env
    TIMEGAP_IN_HOURS=4
    BLUESKY_BOT_USERNAME=<bluesky_username>
    BLUESKY_BOT_PASSWORD=<bluesky_password>
    API_PASSWORD=<a_password_to_close_routes>
    QSTASH_TOKEN=<your_qstash_token>
    WORKER_URL=<worker_url>
    ```

3. **Run version with schedule**

    ```sh
    pnpm dev --test-scheduled
    ```

    This command will expose a route `GET /__scheduled`. Fetch this route if you
    want to test your command.

4. **Make queues work properly locally**

    Since we are using a cloud queue with Upstash, you will need to make a tunnel for it to be able to access your local application. That is easily done using [localtunnel](https://theboroer.github.io/localtunnel-www/).

    Run:

    ```sh
    npm install -g localtunnel
    lt --port 8787
    ```

    Copy the address and paste in the `.dev.vars` file at `WORKER_URL`. Restart the application and you are good to go!
