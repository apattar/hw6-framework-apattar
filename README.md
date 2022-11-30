# Entity Analysis Framework

## Compiling and Starting the Program

To run the program, first `cd` into the `backend` directory, then run the following:
```
mvn compile
mvn exec:exec
```
Wait until you see the message "Backend server running at http://localhost:8080/". It may take a few seconds.

Then, in another terminal instance, `cd` into the `frontend` directory, and run:
```
npm run start
```
This will run the frontend server at http://localhost:3000. It should automatically open in a browser.

On the GUI, you can choose a data plugin and a visualization plugin, enter all options, and click "Generate Output" to see the results.

## How to Add Plugins

### Data Plugins

In the `backend/src/main/java/.../hw6/framework` directory, there's a `DataPlugin.java` file containing the interface for data plugins. To add a data plugin, add a class implementing that interface to the `backend/src/main/java/.../hw6/plugins` directory. Then, add the fully qualified class name of your plugin to the file in the `backend/src/main/resources/META-INF/services` directory. The plugin should then show up in the GUI when compiling and running the framework!

### Visualization Plugins

In `frontend/src/plugins/plugininterface.ts` is the interface for visualization plugins (it's very similar to the interface for data plugins; see the next paragraph for a description of the `.getChartNode()` method's `data` parameter). To add a visualization plugin, add a file that exports a class implementing that interface to the `frontend/src/plugins/` directory. Then, add an import and initialization statement to `frontend/src/plugins/all.ts` (see the file for examples on how to do this). The plugin should then show up in the GUI!

The `.getChartNode()` method takes in a `data` parameter, which contains entity analysis data. The keys of this object (which can be accessed via `Object.keys(data)`) are strings representing the entity types that were found in the text. For any particular entity type, `data[entityType]` will return another object whose keys are strings representing entity names, and whose values are `number` arrays containing the character offsets of all mentions of that particular entity. To illustrate this, here's an example of how to use this `data` object:

```typescript
Object.keys(data).forEach((entityType: string) => {
    // any code inserted here is run for each entity type
    Object.keys(data[entityType]).forEach((entityName: string) => {
        // any code inserted here is run for each entity
        let mentions: number[] = data[entityType][entityName]
        mentions.forEach((mention: number) => {
            // any code here is run for each mention of an entity
            console.log("The entity " + entityName + " of type " + entityType +
                " was mentioned at character " + mention.toString() + "\n");
        })
    })
})

```

## Data Processing

This framework uses the [Stanford CoreNLP](https://stanfordnlp.github.io/CoreNLP/) library for running entity analysis. Entity analysis is a technique in Natural Language Processing (NLP) that uses machine learning to determine when certain types of objects ("entities") are mentioned in text. For example, in the sentence "Mary and Sam went to the store yesterday", entity analysis would recognize "Mary" and "Sam" as mentions of people, and "yesterday" as a mention of a date.

This framework finds the entities in text provided by a data plugin, and returns an object describing the entity types that were found, and the locations where these entities were mentioned. The sample visualization plugin called "Colorizer Plugin" can be used to demonstrate the capabilities of this framework.