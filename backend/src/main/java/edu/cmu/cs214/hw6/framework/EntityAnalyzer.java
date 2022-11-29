package edu.cmu.cs214.hw6.framework;

import edu.stanford.nlp.pipeline.*;

import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.Properties;

import com.google.gson.Gson;

public class EntityAnalyzer {

    /**
     * Returns a string of JSON describing the entities in a String.
     * See README for information on the format of the JSON.
     * 
     * @param text the text to analyze
     * @return String containing JSON description of entities in text
     */
    public String getEntitiesJSON(String text) {
        // use coreNLP library to find entities in text
        Properties props = new Properties();
        props.setProperty("annotators", "tokenize,ssplit,pos,lemma,ner");
        StanfordCoreNLP pipeline = new StanfordCoreNLP(props);
        CoreDocument doc = new CoreDocument(text);
        pipeline.annotate(doc);

        // construct mapping
        Map<String, Map<String, List<Integer>>> entitiesInfo = new HashMap<>();
        for (CoreEntityMention em : doc.entityMentions()) {
            if (entitiesInfo.containsKey(em.entityType())) {
                Map<String, List<Integer>> m = entitiesInfo.get(em.entityType());
                if (m.containsKey(em.text().toLowerCase())) {
                    m.get(em.text().toLowerCase()).add(em.charOffsets().first());
                } else {
                    List<Integer> mentions = new ArrayList<>();
                    mentions.add(em.charOffsets().first());
                    m.put(em.text().toLowerCase(), mentions);
                }
            } else {
                List<Integer> mentions = new ArrayList<>();
                mentions.add(em.charOffsets().first());
                Map<String, List<Integer>> newMap = new HashMap<>();
                newMap.put(em.text().toLowerCase(), mentions);
                entitiesInfo.put(em.entityType(), newMap);
            }
        }

        // convert mapping to JSON, then return
        Gson gson = new Gson();
        return gson.toJson(entitiesInfo);
    }

}
