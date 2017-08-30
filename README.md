<h2>IstSOS JavaScript Core Library</h2>
<hr/>
<h3 class="home-h3"><strong>1. Introduction</strong></h3>
<p>
IstSOS JavaScript core library is a lightweight easy-to-use javascript library that exposes commincation with the IstSOS WA REST interface.
</p>
<p>
Developers can use this library to acquire sensor observation data from IstSOS server and publish it on the Web.
</p>
<h3 class="home-h3"><strong>2. Installation </strong></h3>

<p>Install the library using npm:</p>
<br/>
<pre class="home-code">npm install istsos-javascript-core --save</pre>
<br/>
<p>Or clone the repository:</p>
<br/>
<pre class="home-code">git clone https://github.com/istSOS/javascript-core.git</pre>
<br/>
<h3 class="home-h3"><strong>3. Example</strong></h3>

<p style="font-style: italic">Create container object for all servers</p>
<pre class="home-code">
<span class="text-danger">var</span> <span class="text-primary">container</span> = <span class="text-danger">new</span> istsos.ServerContainer();
</pre>
<br/>
<p style="font-style: italic">Create istsos.Server object providing appropariate URL and desired name</p>
<pre class="home-code">
<span class="text-danger">var</span> <span class="text-primary">server</span> = <span class="text-danger">new</span> istsos.Server({
&nbsp;&nbsp;&nbsp;<span class="text-warning">name</span>: 'test',
&nbsp;&nbsp;&nbsp;<span class="text-warning">url</span>: 'http://istsos.org/istsos/'
});
</pre>
<br/>
<p style="font-style: italic">Create istsos.Database object with appropriate database connection parameters</p>
<pre class="home-code">
<span class="text-danger">var</span> <span class="text-primary">db</span> = <span class="text-danger">new</span> istsos.Database({
&nbsp;&nbsp;&nbsp;<span class="text-warning">dbname</span>: 'istsos',
&nbsp;&nbsp;&nbsp;<span class="text-warning">host</span>: 'localhost',
&nbsp;&nbsp;&nbsp;<span class="text-warning">user</span>: 'postgres',
&nbsp;&nbsp;&nbsp;<span class="text-warning">password</span>: 'postgres',
&nbsp;&nbsp;&nbsp;<span class="text-warning">port</span>: 5432
});
</pre>
<br/>
<p style="font-style: italic">Create istsos.Service object with appropariate name[string], server and database objects</p>
<pre class="home-code">
<span class="text-danger">var</span> <span class="text-primary">service</span> = <span class="text-danger">new</span> istsos.Service({
&nbsp;&nbsp;&nbsp;<span class="text-warning">name</span>: 'demo',
&nbsp;&nbsp;&nbsp;<span class="text-warning">server</span>: server,
&nbsp;&nbsp;&nbsp;<span class="text-warning">opt_db</span>: db
});
</pre>
<br/>
<p style="font-style: italic">Create istsos.Offering object with appropriate name, service and activity properties</p>
<pre class="home-code">
<span class="text-danger">var</span> <span class="text-primary">offering</span> = <span class="text-danger">new</span> istsos.Offering({
&nbsp;&nbsp;&nbsp;<span class="text-warning">offeringName</span>: 'temporary',
&nbsp;&nbsp;&nbsp;<span class="text-warning">service</span>: service,
&nbsp;&nbsp;&nbsp;<span class="text-warning">active</span>: <span class="text-primary">true</span>
});
</pre>
<br/>
<p style="font-style: italic">Create istsos.Procedure object, representing the sensor object to be used for getting the observation data</p>
<pre class="home-code"><span class="text-danger">var</span> <span class="text-primary">procedure</span> = <span class="text-danger">new</span> istsos.Procedure({
&nbsp;&nbsp;&nbsp;<span class="text-warning">name</span>: 'BELLINZONA',
&nbsp;&nbsp;&nbsp;<span class="text-warning">service</span>: service,
&nbsp;&nbsp;&nbsp;<span class="text-warning">foi_name</span>: 'test',
&nbsp;&nbsp;&nbsp;<span class="text-warning">epsg</span>: 3857,
&nbsp;&nbsp;&nbsp;<span class="text-warning">x</span>: 55,
&nbsp;&nbsp;&nbsp;<span class="text-warning">y</span>: 55,
&nbsp;&nbsp;&nbsp;<span class="text-warning">z</span>: 55,
&nbsp;&nbsp;&nbsp;<span class="text-warning">outputs</span>: [],
&nbsp;&nbsp;&nbsp;<span class="text-warning">sensorType</span>: 'insitu-fixed-point'
});
</pre>
<br/>
<p style="font-style: italic">Create istsos.ObservedProperty objects for the purpose of getting temperature and rainfall observations</p>
<pre class="home-code">
<span class="text-danger">var</span> <span class="text-primary">temperature</span> = <span class="text-danger">new</span> istsos.ObservedProperty({
&nbsp;&nbsp;&nbsp;<span class="text-warning">observedName</span>: 'air-temperature',
&nbsp;&nbsp;&nbsp;<span class="text-warning">definitionUrn</span>: 'urn:ogc:def:parameter:x-istsos:1.0:meteo:air:temperature',
&nbsp;&nbsp;&nbsp;<span class="text-warning">service</span>: service,
&nbsp;&nbsp;&nbsp;<span class="text-warning">constraintType</span>: 'between',
&nbsp;&nbsp;&nbsp;<span class="text-warning">value</span>: [0, 300],
});
</pre>
<br/>
<pre class="home-code">
<span class="text-danger">var</span> <span class="text-primary">rainfall</span> = <span class="text-danger">new</span> istsos.ObservedProperty({
&nbsp;&nbsp;&nbsp;<span class="text-warning">observedName</span>: 'air-rainfall',
&nbsp;&nbsp;&nbsp;<span class="text-warning">definitionUrn</span>: 'urn:ogc:def:parameter:x-istsos:1.0:meteo:air:rainfall',
&nbsp;&nbsp;&nbsp;<span class="text-warning">service</span>: service,
&nbsp;&nbsp;&nbsp;<span class="text-warning">constraintType</span>: 'between',
&nbsp;&nbsp;&nbsp;<span class="text-warning">value</span>: [0, 50],
});
</pre>
<br/>
<p style="font-style: italic">Create istsos.Date objects, representing the observation data interval</p>
<pre class="home-code">
<span class="text-danger">var</span> <span class="text-primary">beginTime</span> = <span class="text-danger">new</span> istsos.Date({
&nbsp;&nbsp;&nbsp;<span class="text-warning">year</span>: 2014,
&nbsp;&nbsp;&nbsp;<span class="text-warning">month</span>: 5,
&nbsp;&nbsp;&nbsp;<span class="text-warning">day</span>: 27,
&nbsp;&nbsp;&nbsp;<span class="text-warning">hours</span>: 0,
&nbsp;&nbsp;&nbsp;<span class="text-warning">minutes</span>: 0,
&nbsp;&nbsp;&nbsp;<span class="text-warning">seconds</span>: 0,
&nbsp;&nbsp;&nbsp;<span class="text-warning">gmt</span>: 2
});
</pre>
<br/>
<pre class="home-code"><span class="text-danger">var</span> <span class="text-primary">endTime</span> = <span class="text-danger">new</span> istsos.Date({
&nbsp;&nbsp;&nbsp;<span class="text-warning">year</span>: 2014,
&nbsp;&nbsp;&nbsp;<span class="text-warning">month</span>: 5,
&nbsp;&nbsp;&nbsp;<span class="text-warning">day</span>: 31,
&nbsp;&nbsp;&nbsp;<span class="text-warning">hours</span>: 0,
&nbsp;&nbsp;&nbsp;<span class="text-warning">minutes</span>: 0,
&nbsp;&nbsp;&nbsp;<span class="text-warning">seconds</span>: 0,
&nbsp;&nbsp;&nbsp;<span class="text-warning">gmt</span>: 2
});
</pre>
<br/>
<p style="font-style: italic">Perform get observation request</p>
<pre class="home-code"><span class="text-danger">var</span> <span class="text-primary">observations</span> = service.getObservations({
&nbsp;&nbsp;&nbsp;<span class="text-warning">offering</span>: offering,
&nbsp;&nbsp;&nbsp;<span class="text-warning">procedures</span>: [procedure],
&nbsp;&nbsp;&nbsp;<span class="text-warning">observedProperties</span>: [temperature, rainfall]
&nbsp;&nbsp;&nbsp;<span class="text-warning">begin</span>: beginTime,
&nbsp;&nbsp;&nbsp;<span class="text-warning">end</span>: endTime
});
</pre>
<br/>
<p style="font-style: italic">Two ways of handling the response:</p>
<pre class="home-code">/* PROMISE WAY */<br/><span class="text-primary">observations</span>.then(function(result) {
&nbsp;&nbsp;&nbsp;<span class="text-primary">console</span>.log(result)<br/>});<br/><br/>/* EVENT LISTENER WAY */
service.on('GETOBSERVATIONS', function(result) {
&nbsp;&nbsp;&nbsp;<span class="text-primary">console</span>.log(result)
});
</pre>
<br/><br/>
